<?php

namespace App\Services;

use App\Repositories\Interfaces\ContactRepositoryInterface;
use Exception;
use Illuminate\Support\Facades\Log;

class ContactService
{
    protected $contactRepository;

    public function __construct(ContactRepositoryInterface $contactRepository)
    {
        $this->contactRepository = $contactRepository;
    }

    public function getAllContacts()
    {
        return $this->contactRepository->all();
    }

    public function getContactById(int $id)
    {
        return $this->contactRepository->findById($id);
    }

    public function createContact(array $attributes)
    {
        try {
            return $this->contactRepository->create($attributes);
        } catch (Exception $e) {
            Log::error('Error creating contact: ' . $e->getMessage());
            throw new Exception('Unable to create contact: ' . $e->getMessage());
        }
    }

    public function updateContact(int $id, array $attributes)
    {
        try {
            return $this->contactRepository->update($id, $attributes);
        } catch (Exception $e) {
            Log::error('Error updating contact: ' . $e->getMessage());
            throw new Exception('Unable to update contact: ' . $e->getMessage());
        }
    }

    public function deleteContact(int $id)
    {
        try {
            return $this->contactRepository->delete($id);
        } catch (Exception $e) {
            Log::error('Error deleting contact: ' . $e->getMessage());
            throw new Exception('Unable to delete contact: ' . $e->getMessage());
        }
    }

    public function getContactsByEmail(string $email)
    {
        return $this->contactRepository->findByEmail($email);
    }

    public function getContactsByStatus(string $status)
    {
        return $this->contactRepository->findByStatus($status);
    }
}