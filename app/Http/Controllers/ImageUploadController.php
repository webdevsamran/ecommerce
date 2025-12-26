<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageUploadController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Upload image and return the URL
     */
    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // Max 5MB
            'folder' => 'nullable|string|in:products,avatars,reviews',
        ]);

        $folder = $request->folder ?? 'uploads';
        $file = $request->file('image');
        
        // Generate unique filename
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();

        // Store in public disk
        $path = $file->storeAs($folder, $filename, 'public');

        // Return the URL
        return response()->json([
            'success' => true,
            'url' => Storage::url($path),
            'path' => $path,
        ]);
    }

    /**
     * Delete an uploaded image
     */
    public function destroy(Request $request)
    {
        $request->validate([
            'path' => 'required|string',
        ]);

        $path = $request->path;

        // Security check - only allow deleting from allowed folders
        $allowedFolders = ['products', 'avatars', 'reviews', 'uploads'];
        $folder = explode('/', $path)[0] ?? '';
        
        if (!in_array($folder, $allowedFolders)) {
            return response()->json(['success' => false, 'error' => 'Invalid path'], 403);
        }

        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
            return response()->json(['success' => true]);
        }

        return response()->json(['success' => false, 'error' => 'File not found'], 404);
    }
}
