/*==============================================================*/
/* ATHLETIX - Tecnología sin productos unisex                    */
/* Tecnología solo maneja Hombre y Mujer.                        */
/*==============================================================*/
update producto set prd_publico = 'Hombre' where prd_codigo in ('sa', 'cb', 'sp');
update producto set prd_publico = 'Mujer'  where prd_codigo = 'hb';
