--Reporte de gastos
select  e.expense_date, ep.name, p.price, ed.quantity, ed.quantity * p.price as total from public.expenses e
join public.expense_details ed on ed.expense_id = e.id
join public.expense_products ep on ep.id = ed.product_id
join public.prices p on p.id = ed.price_id and priceable_type = 'App\ExpenseProduct'
where e.expense_date >= '2020-11-01' and e.deleted_at is null order by e.id desc


SELECT products.name,sum(sd.quantity)
FROM public.sales s
join public.sale_details sd on s.id = sd.sale_id
join public.prices p on sd.price_id = p.id
join public.bundles products on products.id = p.priceable_id and p.priceable_type = 'App\Bundle'
where sd.created_at between '2020-11-01' and '2020-11-28'
group by products.name
order by sum(sd.quantity) desc


--QUERY CORRECTA
SELECT products.name,sum(sd.quantity)
FROM public.sales s
join public.sale_details sd on s.id = sd.sale_id
join public.prices p on sd.price_id = p.id
join public.products products on products.id = p.priceable_id and p.priceable_type = 'App\Product'
where sd.created_at between '2020-11-27' and '2020-11-28'
group by products.name
order by sum(sd.quantity) desc

--Promedio ventas por horas entre fechas
SELECT TO_CHAR(created_at, 'HH24') as hours, count(id) FROM public.sales where deleted_at is null
and created_at::date between '2020-12-01' and '2021-02-12' group by hours


-- Ventas del mes
SELECT pm.name, pms.created_at, pms.amount  FROM public.payment_method_sales pms
join public.payment_methods pm on pm.id = pms.payment_method_id
join public.sales s on s.id = pms.sale_id
where pms.payment_method_id in (1,2,5,6,7,8) and pms.created_at between '2021-02-01 00:00:00' and '2021-02-28 23:59:59'
and s.deleted_at is null
