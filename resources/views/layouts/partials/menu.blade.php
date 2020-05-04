<ul class="sidebar-menu" data-widget="tree">
    <li class="header"></li>
    <li class="treeview">
        <a href="#"><i class="fa fa-link"></i> <span>Productos</span>
            <span class="pull-right-container">
                <i class="fa fa-angle-left pull-right"></i>
              </span>
        </a>
        <ul class="treeview-menu">
            @can('view products')
                    <li><a href="{{route('products.index')}}">Ver Productos</a></li>
            @endcan
        </ul>
    </li>
</ul>
<ul class="sidebar-menu" data-widget="tree">

    <li class="treeview">
        <a href="#"><i class="fa fa-link"></i> <span>Configuración</span>
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
