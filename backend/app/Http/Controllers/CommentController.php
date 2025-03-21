<?php

namespace App\Http\Controllers;

use App\Http\Requests\CommentRequest;
use App\Services\CommentService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CommentController extends Controller
{
    protected $commentService;

    public function __construct(CommentService $commentService)
    {
        $this->commentService = $commentService;
    }

    /**
     * Display a listing of the comments.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $comments = $this->commentService->getAllComments();
            return response()->json([
                'status' => 'success',
                'data' => $comments
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Store a newly created comment in storage.
     *
     * @param  \App\Http\Requests\CommentRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CommentRequest $request)
    {
        try {
            $userId = $request->user()->id;
            
            $comment = $this->commentService->createComment([
                'user_id' => $userId,
                'product_id' => $request->input('product_id'),
                'content' => $request->input('content'),
                'rating' => $request->input('rating'),
            ]);
            
            return response()->json([
                'status' => 'success',
                'message' => 'Comment created successfully',
                'data' => $comment
            ], Response::HTTP_CREATED);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified comment.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {
            $comment = $this->commentService->getCommentById($id);
            return response()->json([
                'status' => 'success',
                'data' => $comment
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update the specified comment in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        try {
            $request->validate([
                'content' => 'required|string',
                'rating' => 'required|integer|min:1|max:5',
            ]);
            
            $comment = $this->commentService->getCommentById($id);
            
            // Make sure the user owns the comment
            if ($comment->user_id !== $request->user()->id) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized'
                ], Response::HTTP_FORBIDDEN);
            }
            
            $updatedComment = $this->commentService->updateComment($id, [
                'content' => $request->input('content'),
                'rating' => $request->input('rating'),
            ]);
            
            return response()->json([
                'status' => 'success',
                'message' => 'Comment updated successfully',
                'data' => $updatedComment
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified comment from storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
        try {
            $comment = $this->commentService->getCommentById($id);
            
            // Make sure the user owns the comment or is an admin
            if ($comment->user_id !== $request->user()->id && $request->user()->role->name !== 'Admin') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized'
                ], Response::HTTP_FORBIDDEN);
            }
            
            $this->commentService->deleteComment($id);
            
            return response()->json([
                'status' => 'success',
                'message' => 'Comment deleted successfully'
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get comments by product.
     *
     * @param  int  $productId
     * @return \Illuminate\Http\Response
     */
    public function byProduct($productId)
    {
        try {
            $comments = $this->commentService->getCommentsByProduct($productId);
            return response()->json([
                'status' => 'success',
                'data' => $comments
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get comments by user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function byUser(Request $request)
    {
        try {
            $userId = $request->user()->id;
            $comments = $this->commentService->getCommentsByUser($userId);
            
            return response()->json([
                'status' => 'success',
                'data' => $comments
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get product rating.
     *
     * @param  int  $productId
     * @return \Illuminate\Http\Response
     */
    public function productRating($productId)
    {
        try {
            $rating = $this->commentService->getProductRating($productId);
            
            return response()->json([
                'status' => 'success',
                'data' => [
                    'rating' => $rating
                ]
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}