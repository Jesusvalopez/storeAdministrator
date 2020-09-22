<?php

namespace App\Policies;

use App\Expense;
use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Auth\Access\Response;

class ExpensePolicy
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
        if ($user->can('view expenses')) {
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
    public function view(User $user, Expense $expense)
    {
        //
    }

    /**
     * Determine whether the user can create models.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        if ($user->can('create expenses')) {
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
    public function update(User $user, Expense $expense)
    {
        //
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\User  $user
     * @param  \App\Sale  $sale
     * @return mixed
     */
    public function delete(User $user, Expense $expense)
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
    public function restore(User $user, Expense $expense)
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
    public function forceDelete(User $user, Expense $expense)
    {
        //
    }
}
