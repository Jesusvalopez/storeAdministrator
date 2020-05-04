<?php

namespace App\Policies;

use App\PaymentMethod;
use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Auth\Access\Response;

class PaymentMethodPolicy
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
        if ($user->can('view payment methods')) {
            return Response::allow();
        }else{
            return Response::deny('No tiene permisos para acceder.');
        }
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\User  $user
     * @param  \App\PaymentMethod  $paymentMethod
     * @return mixed
     */
    public function view(User $user, PaymentMethod $paymentMethod)
    {
        if ($user->can('view payment methods')) {
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
        if ($user->can('create payment methods')) {
            return Response::allow();
        }else{
            return Response::deny('No tiene permisos para acceder.');
        }
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\User  $user
     * @param  \App\PaymentMethod  $paymentMethod
     * @return mixed
     */
    public function update(User $user, PaymentMethod $paymentMethod)
    {
        if ($user->can('edit payment methods')) {
            return Response::allow();
        }else{
            return Response::deny('No tiene permisos para acceder.');
        }
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\User  $user
     * @param  \App\PaymentMethod  $paymentMethod
     * @return mixed
     */
    public function delete(User $user, PaymentMethod $paymentMethod)
    {
        if ($user->can('delete payment methods')) {
            return Response::allow();
        }else{
            return Response::deny('No tiene permisos para acceder.');
        }
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\User  $user
     * @param  \App\PaymentMethod  $paymentMethod
     * @return mixed
     */
    public function restore(User $user, PaymentMethod $paymentMethod)
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\User  $user
     * @param  \App\PaymentMethod  $paymentMethod
     * @return mixed
     */
    public function forceDelete(User $user, PaymentMethod $paymentMethod)
    {
        //
    }
}
