<?php

namespace App\Http\Controllers;

use App\Models\Address;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $addresses = $user->addresses()->latest()->get();

        return inertia('Profile/Addresses', [
            'addresses' => $addresses,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:shipping,billing',
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'street' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'state' => 'nullable|string|max:100',
            'zip' => 'required|string|max:20',
            'country' => 'required|string|max:100',
            'is_default' => 'boolean',
        ]);

        $user = auth()->user();

        // If setting as default, unset other defaults
        if ($validated['is_default'] ?? false) {
            $user->addresses()->where('type', $validated['type'])->update(['is_default' => false]);
        }

        $user->addresses()->create($validated);

        return back()->with('success', 'Address added successfully!');
    }

    public function update(Request $request, Address $address)
    {
        // Ensure user owns the address
        if ($address->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'type' => 'required|in:shipping,billing',
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'street' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'state' => 'nullable|string|max:100',
            'zip' => 'required|string|max:20',
            'country' => 'required|string|max:100',
            'is_default' => 'boolean',
        ]);

        // If setting as default, unset other defaults
        if ($validated['is_default'] ?? false) {
            auth()->user()->addresses()
                ->where('type', $validated['type'])
                ->where('id', '!=', $address->id)
                ->update(['is_default' => false]);
        }

        $address->update($validated);

        return back()->with('success', 'Address updated successfully!');
    }

    public function destroy(Address $address)
    {
        // Ensure user owns the address
        if ($address->user_id !== auth()->id()) {
            abort(403);
        }

        $address->delete();

        return back()->with('success', 'Address deleted successfully!');
    }

    public function setDefault(Address $address)
    {
        // Ensure user owns the address
        if ($address->user_id !== auth()->id()) {
            abort(403);
        }

        // Unset other defaults of same type
        auth()->user()->addresses()
            ->where('type', $address->type)
            ->update(['is_default' => false]);

        $address->update(['is_default' => true]);

        return back()->with('success', 'Default address updated!');
    }
}
