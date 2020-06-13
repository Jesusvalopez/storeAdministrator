<?php

namespace App\Policies;

use App\Cashbox;
use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Auth\Access\Response;

class CashboxPolicy
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
        //
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\User  $user
     * @param  \App\Cashbox  $cashbox
     * @return mixed
     */
    public function view(User $user, Cashbox $cashbox)
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
        if ($user->can('create cashboxes')) {
            return Response::allow();
        }else{
            return Response::deny('No tiene permisos para acceder.');
        }
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\User  $user
     * @param  \App\Cashbox  $cashbox
     * @return mixed
     */
    public function update(User $user, Cashbox $cashbox)
    {
        //
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\User  $user
     * @param  \App\Cashbox  $cashbox
     * @return mixed
     */
    public function delete(User $user, Cashbox $cashbox)
    {
        //
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\User  $user
     * @param  \App\Cashbox  $cashbox
     * @return mixed
     */
    public function restore(User $user, Cashbox $cashbox)
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\User  $user
     * @param  \App\Cashbox  $cashbox
     * @return mixed
     */
    public function forceDelete(User $user, Cashbox $cashbox)
    {
        //
    }
}
