<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBook extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'cover_delete' => 'sometimes|nullable',
            'cover_file' => 'sometimes|nullable|image',
            'extract_delete' => 'sometimes|nullable',
            'extract_file' => 'sometimes|nullable|file',
            'publisher_id' => 'sometimes|required',
            'isbn' => 'sometimes|required|isbn',
            'title' => 'sometimes|required',
            'category' => 'sometimes|required|in:novel,comic,cook,economy,politics,history,fantasy,biography',
            'description' => 'sometimes|required',
            'formats.*' => 'sometimes|in:pocket,paperback,pdf,epub,kindle',
            'price' => 'sometimes|required|numeric',
            'commentable' => 'sometimes|boolean',
            'publication_date' => 'sometimes|required|date',
        ];
    }
}