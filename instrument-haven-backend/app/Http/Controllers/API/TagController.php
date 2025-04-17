<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Repositories\TagRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TagController extends Controller
{
    protected $tagRepository;

    public function __construct(TagRepository $tagRepository)
    {
        $this->tagRepository = $tagRepository;
    }

    public function index()
    {
        $tags = $this->tagRepository->all();
        return response()->json(['data' => $tags]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:tags',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $tag = $this->tagRepository->create($request->all());
        return response()->json(['message' => 'Tag created successfully', 'data' => $tag], 201);
    }

    public function show($id)
    {
        $tag = $this->tagRepository->find($id);
        return response()->json(['data' => $tag]);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:tags,name,' . $id,
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $tag = $this->tagRepository->update($request->all(), $id);
        return response()->json(['message' => 'Tag updated successfully', 'data' => $tag]);
    }

    public function destroy($id)
    {
        $this->tagRepository->delete($id);
        return response()->json(['message' => 'Tag deleted successfully']);
    }
}