<ul class="sidebar-menu" data-widget="tree">
    <li class="header"></li>

            @can('view products')
                <li><a href="{{route('sales.create')}}"><i class="fa fa-edit"></i><span>POS</span></a></li>
            @endcan

</ul>
<ul class="sidebar-menu" data-widget="tree">

    <li class="treeview">
        <a href="#"><i class="fa fa-list"></i> <span>Productos</span>
            <span class="pull-right-container">
                <i class="fa fa-angle-left pull-right"></i>
              </span>
        </a>
        <ul class="treeview-menu">
            @can('view products')
                <li><a href="{{route('products.create')}}">Ver Productos</a></li>
            @endcan
        </ul>
    </li>
</ul>
<ul class="sidebar-menu" data-widget="tree">

    @can('view discounts')
        <li><a href="{{route('discounts.create')}}"><i class="fa  fa-bullhorn"></i><span>Descuentos</span></a></li>
    @endcan

</ul>

<ul class="sidebar-menu" data-widget="tree">

    <li class="treeview">
        <a href="#"><i class="fa fa-gear"></i> <span>Configuración</span>
            <span class="pull-right-container">
                <i class="fa fa-angle-left pull-right"></i>
              </span>
        </a>
        <ul class="treeview-menu">
            @can('view price type')
                <li><a href="{{route('price-types.create')}}">Tipos de Precios</a></li>
            @endcan
        </ul>
    </li>
</ul>
