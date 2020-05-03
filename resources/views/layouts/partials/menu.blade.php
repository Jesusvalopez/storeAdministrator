<ul class="sidebar-menu" data-widget="tree">
    <li class="header"></li>
    <li class="treeview">
        <a href="#"><i class="fa fa-link"></i> <span>Configuración</span>
            <span class="pull-right-container">
                <i class="fa fa-angle-left pull-right"></i>
              </span>
        </a>
        <ul class="treeview-menu">
            <li><a href="#">Productos</a></li>
            @can('view price type')
                <li><a href="{{route('price-types.create')}}">Tipos de Precios</a></li>
            @endcan
        </ul>
    </li>
</ul>
