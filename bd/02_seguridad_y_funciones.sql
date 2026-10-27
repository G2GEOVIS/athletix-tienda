/*==============================================================*/
/* ATHLETIX - Seguridad por filas (RLS), funciones y triggers   */
/* Ejecutar después de 01_tablas.sql                            */
/*==============================================================*/

/*---------------- Funciones de apoyo ----------------*/
create or replace function es_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from administrador where adm_usuario = auth.uid());
$$;

-- Cédula del cliente que tiene la sesión abierta
create or replace function mi_cedula() returns char(10)
language sql stable security definer set search_path = public as $$
  select cli_cedula from cliente where cli_usuario = auth.uid();
$$;

create or replace function cedula_registrada(p_cedula text) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from cliente where cli_cedula = p_cedula);
$$;

create or replace function correo_registrado(p_correo text) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from auth.users where lower(email) = lower(trim(p_correo)));
$$;

/*---------------- Triggers ----------------*/
-- El correo del cliente siempre es el de su cuenta (no se puede falsificar)
create or replace function tib_cliente() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  select email into new.cli_correo from auth.users where id = new.cli_usuario;
  if tg_op = 'UPDATE' then
    new.cli_cedula := old.cli_cedula;           -- la cédula no se cambia
    new.cli_usuario := old.cli_usuario;
    new.cli_fecha_registro := old.cli_fecha_registro;
  end if;
  return new;
end $$;
create trigger tib_cliente before insert or update on cliente
  for each row execute function tib_cliente();

-- Solo opina quien compró y retiró el producto; el autor se arma con su nombre
create or replace function tib_resena() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if not exists (
    select 1 from pedidocliente p join producto_pedcli d on d.ped_numero = p.ped_numero
     where p.cli_cedula = new.cli_cedula and d.prd_codigo = new.prd_codigo and p.ped_estado = 'Retirado'
  ) then
    raise exception 'Solo los clientes que compraron y retiraron este producto pueden dejar una reseña';
  end if;
  select split_part(trim(cli_nombres), ' ', 1) || ' ' || left(trim(cli_apellidos), 1) || '.'
    into new.res_autor from cliente where cli_cedula = new.cli_cedula;
  return new;
end $$;
create trigger tib_resena before insert or update on resena
  for each row execute function tib_resena();

/*---------------- Vista de calificaciones ----------------*/
create or replace view vista_calificaciones with (security_invoker = true) as
select p.prd_codigo,
       coalesce(round(avg(r.res_estrellas), 1), 0) as promedio,
       count(r.res_codigo) as opiniones
  from producto p left join resena r on r.prd_codigo = p.prd_codigo
 group by p.prd_codigo;

/*---------------- Seguridad por filas ----------------*/
alter table categoria       enable row level security;
alter table producto        enable row level security;
alter table producto_talla  enable row level security;
alter table tienda          enable row level security;
alter table cliente         enable row level security;
alter table administrador   enable row level security;
alter table tarjeta         enable row level security;
alter table pedidocliente   enable row level security;
alter table pagos           enable row level security;
alter table producto_pedcli enable row level security;
alter table resena          enable row level security;

create policy "catalogo visible" on categoria      for select using (true);
create policy "catalogo visible" on producto       for select using (prd_activo or es_admin());
create policy "catalogo visible" on producto_talla for select using (true);
create policy "catalogo visible" on tienda         for select using (true);

create policy "mi perfil ver"    on cliente for select using (cli_usuario = auth.uid() or es_admin());
create policy "mi perfil crear"  on cliente for insert with check (cli_usuario = auth.uid());
create policy "mi perfil editar" on cliente for update using (cli_usuario = auth.uid()) with check (cli_usuario = auth.uid());

create policy "solo admin" on administrador for select using (adm_usuario = auth.uid());

create policy "mis tarjetas" on tarjeta for all using (cli_cedula = mi_cedula()) with check (cli_cedula = mi_cedula());

create policy "mis pedidos" on pedidocliente for select using (cli_cedula = mi_cedula() or es_admin());
create policy "mis pagos" on pagos for select using (
  exists (select 1 from pedidocliente p where p.ped_numero = pagos.ped_numero and (p.cli_cedula = mi_cedula() or es_admin())));
create policy "mi detalle" on producto_pedcli for select using (
  exists (select 1 from pedidocliente p where p.ped_numero = producto_pedcli.ped_numero and (p.cli_cedula = mi_cedula() or es_admin())));

create policy "resenas visibles" on resena for select using (true);
create policy "mi resena crear"  on resena for insert with check (cli_cedula = mi_cedula());
create policy "mi resena editar" on resena for update using (cli_cedula = mi_cedula()) with check (cli_cedula = mi_cedula());
create policy "mi resena borrar" on resena for delete using (cli_cedula = mi_cedula());

revoke all on cliente, tarjeta, pedidocliente, pagos, producto_pedcli, administrador from anon;

/*---------------- Crear pedido (una sola transacción) ----------------*/
-- Atomicidad: todo o nada. Concurrencia: bloqueo por fila del stock en orden fijo (sin deadlocks).
-- Idempotencia: p_clave evita pedidos duplicados por reintentos.
create or replace function crear_pedido(p_tienda int2, p_tarjeta int4, p_items jsonb, p_clave uuid default null)
returns table (ped_numero numeric, ped_codigo text, ped_total numeric)
language plpgsql security definer set search_path = public as $$
declare
  v_cedula   char(10) := mi_cedula();
  v_numero   numeric(12);
  v_subtotal numeric(12,2) := 0;
  v_iva      numeric(12,2);
  r          record;
begin
  if auth.uid() is null then raise exception 'Debes iniciar sesión para comprar'; end if;
  if v_cedula is null then raise exception 'Completa tu perfil antes de comprar'; end if;

  if p_clave is not null then
    return query select p.ped_numero, 'AX-' || to_char(p.ped_fecha, 'YYYY') || '-' || lpad(p.ped_numero::text, 5, '0'), p.ped_total
      from pedidocliente p where p.ped_clave = p_clave and p.cli_cedula = v_cedula;
    if found then return; end if;
  end if;

  if not exists (select 1 from tarjeta where tar_codigo = p_tarjeta and cli_cedula = v_cedula) then raise exception 'El método de pago no es válido'; end if;
  if not exists (select 1 from tienda where tie_codigo = p_tienda) then raise exception 'La tienda de retiro no es válida'; end if;
  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then raise exception 'El carrito está vacío'; end if;
  if jsonb_array_length(p_items) > 30 then raise exception 'Demasiados productos en un solo pedido'; end if;
  if (select count(*) from pedidocliente where cli_cedula = v_cedula and ped_fecha > now() - interval '1 minute') >= 5 then
    raise exception 'Hiciste demasiados pedidos seguidos. Espera un minuto.';
  end if;

  begin
    for r in
      select p.prd_codigo, p.prd_nombre, p.prd_precio, p.prd_usa_talla, p.prd_activo,
             coalesce(nullif(x->>'talla', ''), 'U') as talla,
             sum((x->>'cantidad')::int) as cantidad
        from jsonb_array_elements(p_items) x
        left join producto p on p.prd_codigo = x->>'producto'
       group by p.prd_codigo, p.prd_nombre, p.prd_precio, p.prd_usa_talla, p.prd_activo, coalesce(nullif(x->>'talla', ''), 'U')
       order by p.prd_codigo, 6
    loop
      if r.prd_codigo is null or not r.prd_activo then raise exception 'Un producto del carrito ya no está disponible'; end if;
      if r.cantidad is null or r.cantidad < 1 or r.cantidad > 10 then raise exception 'La cantidad de "%" debe estar entre 1 y 10', r.prd_nombre; end if;
      if r.prd_usa_talla and r.talla = 'U' then raise exception 'Elige una talla para "%"', r.prd_nombre; end if;

      update producto_talla set pta_existencia = pta_existencia - r.cantidad
       where prd_codigo = r.prd_codigo and pta_talla = r.talla and pta_existencia >= r.cantidad;
      if not found then
        raise exception 'No hay stock suficiente de "%"%', r.prd_nombre, case when r.talla = 'U' then '' else ' talla ' || r.talla end;
      end if;
      v_subtotal := v_subtotal + r.prd_precio * r.cantidad;
    end loop;

    v_iva := round(v_subtotal * 0.15, 2);
    insert into pedidocliente (cli_cedula, tie_codigo, ped_subtotal, ped_iva, ped_total, ped_clave)
    values (v_cedula, p_tienda, v_subtotal, v_iva, v_subtotal + v_iva, p_clave)
    returning pedidocliente.ped_numero into v_numero;

    insert into producto_pedcli (ped_numero, prd_codigo, ppc_talla, ppc_cantidad, ppc_precio)
    select v_numero, p.prd_codigo, coalesce(nullif(x->>'talla', ''), 'U'), sum((x->>'cantidad')::int), p.prd_precio
      from jsonb_array_elements(p_items) x join producto p on p.prd_codigo = x->>'producto'
     group by p.prd_codigo, coalesce(nullif(x->>'talla', ''), 'U'), p.prd_precio;

    insert into pagos (pag_codigo, ped_numero, tar_codigo, pag_monto)
    values ('PAG-' || lpad(v_numero::text, 8, '0'), v_numero, p_tarjeta, v_subtotal + v_iva);
  exception when unique_violation then
    if p_clave is not null then
      return query select p.ped_numero, 'AX-' || to_char(p.ped_fecha, 'YYYY') || '-' || lpad(p.ped_numero::text, 5, '0'), p.ped_total
        from pedidocliente p where p.ped_clave = p_clave and p.cli_cedula = v_cedula;
      if found then return; end if;
    end if;
    raise;
  end;

  return query select v_numero, 'AX-' || to_char(now(), 'YYYY') || '-' || lpad(v_numero::text, 5, '0'), v_subtotal + v_iva;
end $$;

/*---------------- Cambiar estado (solo administrador) ----------------*/
create or replace function cambiar_estado_pedido(p_numero numeric, p_estado varchar)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_actual varchar;
  permitidos text[];
begin
  if not es_admin() then raise exception 'Solo un administrador puede cambiar el estado'; end if;
  select ped_estado into v_actual from pedidocliente where ped_numero = p_numero for update;
  if not found then raise exception 'El pedido no existe'; end if;
  permitidos := case v_actual
    when 'Recibido'   then array['Preparando', 'Listo', 'Cancelado']
    when 'Preparando' then array['Listo', 'Cancelado']
    when 'Listo'      then array['Retirado', 'Cancelado']
    else array[]::text[] end;
  if not (p_estado = any (permitidos)) then raise exception 'No se puede pasar un pedido de "%" a "%"', v_actual, p_estado; end if;
  if p_estado = 'Cancelado' then
    update producto_talla t set pta_existencia = t.pta_existencia + d.ppc_cantidad
      from producto_pedcli d
     where d.ped_numero = p_numero and t.prd_codigo = d.prd_codigo and t.pta_talla = d.ppc_talla;
  end if;
  update pedidocliente set ped_estado = p_estado, ped_fecha_actualizacion = now() where ped_numero = p_numero;
end $$;

/*---------------- Panel del administrador ----------------*/
create or replace function pedidos_nuevos() returns int
language plpgsql stable security definer set search_path = public as $$
begin
  if not es_admin() then return 0; end if;
  return (select count(*) from pedidocliente where ped_estado = 'Recibido');
end $$;

create or replace function pedidos_admin()
returns table (ped_numero numeric, ped_codigo text, ped_estado varchar, ped_total numeric, ped_fecha timestamptz,
               cliente text, cli_correo varchar, cli_telefono char(10), cli_cedula char(10),
               tie_nombre varchar, tie_horario varchar, productos text)
language plpgsql stable security definer set search_path = public as $$
begin
  if not es_admin() then raise exception 'Solo un administrador puede ver todos los pedidos'; end if;
  return query
  select p.ped_numero, 'AX-' || to_char(p.ped_fecha, 'YYYY') || '-' || lpad(p.ped_numero::text, 5, '0'),
         p.ped_estado, p.ped_total, p.ped_fecha,
         c.cli_nombres || ' ' || c.cli_apellidos, c.cli_correo, c.cli_telefono, c.cli_cedula,
         t.tie_nombre, t.tie_horario,
         (select string_agg(d.ppc_cantidad || ' × ' || pr.prd_nombre || case when d.ppc_talla = 'U' then '' else ' (talla ' || d.ppc_talla || ')' end, ', ')
            from producto_pedcli d join producto pr on pr.prd_codigo = d.prd_codigo where d.ped_numero = p.ped_numero)
    from pedidocliente p join cliente c on c.cli_cedula = p.cli_cedula join tienda t on t.tie_codigo = p.tie_codigo
   order by p.ped_fecha desc;
end $$;

/*---------------- Permisos de ejecución ----------------*/
revoke execute on function crear_pedido(int2, int4, jsonb, uuid) from public, anon;
grant  execute on function crear_pedido(int2, int4, jsonb, uuid) to authenticated;
revoke execute on function cambiar_estado_pedido(numeric, varchar) from public, anon;
grant  execute on function cambiar_estado_pedido(numeric, varchar) to authenticated;
revoke execute on function pedidos_nuevos() from public, anon;
grant  execute on function pedidos_nuevos() to authenticated;
revoke execute on function pedidos_admin() from public, anon;
grant  execute on function pedidos_admin() to authenticated;
grant  execute on function es_admin(), mi_cedula() to authenticated;
grant  execute on function cedula_registrada(text), correo_registrado(text) to anon, authenticated;
