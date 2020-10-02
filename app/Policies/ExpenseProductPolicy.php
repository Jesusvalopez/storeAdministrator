<?php

namespace App\Policies;

use App\ExpenseProduct;
use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Auth\Access\Response;

class ExpenseProductPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function viewAny(User $user)
    {
        if ($user->can('view expense products')) {
            return Response::allow();
        }else{
            return Response::deny('No tiene permisos para acceder.');
        }
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\User  $user
     * @param  \App\Sale  $sale
     * @return mixed
     */
    public function view(User $user, ExpenseProduct $expense)
    {
        if ($user->can('view expense products')) {
            return true;
        }else{
            return false;
        }
    }

    /**
     * Determine whether the user can create models.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        if ($user->can('create expense products')) {
            return Response::allow();
        }else{
            return Response::deny('No tiene permisos para acceder.');
        }
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\User  $user
     * @param  \App\Sale  $sale
     * @return mixed
     */
    public function update(User $user, ExpenseProduct $expense)
    {
        if ($user->can('edit expense products')) {
            return Response::allow();
        }else{
            return Response::deny('No tiene permisos para acceder.');
        }
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\User  $user
     * @param  \App\Sale  $sale
     * @return mixed
     */
    public function delete(User $user, ExpenseProduct $expense)
    {
        //
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\User  $user
     * @param  \App\Sale  $sale
     * @return mixed
     */
    public function restore(User $user, ExpenseProduct $expense)
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\User  $user
     * @param  \App\Sale  $sale
     * @return mixed
     */
    public function forceDelete(User $user, ExpenseProduct $expense)
    {
        //
    }
}
