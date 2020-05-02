<?php

namespace App\Policies;

use App\PriceType;
use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PriceTypePolicy
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
     * @param  \App\PriceType  $priceType
     * @return mixed
     */
    public function view(User $user, PriceType $priceType)
    {
        if ($user->can('view price type')) {
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
        //
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\User  $user
     * @param  \App\PriceType  $priceType
     * @return mixed
     */
    public function update(User $user, PriceType $priceType)
    {
        //
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\User  $user
     * @param  \App\PriceType  $priceType
     * @return mixed
     */
    public function delete(User $user, PriceType $priceType)
    {
        //
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\User  $user
     * @param  \App\PriceType  $priceType
     * @return mixed
     */
    public function restore(User $user, PriceType $priceType)
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\User  $user
     * @param  \App\PriceType  $priceType
     * @return mixed
     */
    public function forceDelete(User $user, PriceType $priceType)
    {
        //
    }
}
