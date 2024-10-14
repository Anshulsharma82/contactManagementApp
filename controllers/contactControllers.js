const { createCustomError } = require('../errors/customError')
const expressAsyncHandler = require('express-async-handler')
const Contact = require("../models/contactsModel")

//@desc Get all contacts
//@route GET /api/contacts
//@access Private
const getContacts = expressAsyncHandler (async (req, res) => {
    const contacts = await Contact.find({ user_id: req.user.id})
    res.status(200).json( contacts )
})

//@desc Create new contact
//@route POST /api/contacts
//@access Private
const createContact = expressAsyncHandler (async (req, res, next) => {
    console.log("The request body is", req.body)
    const { name, phone, email } = req.body
    if (!name || !email || !phone) {
        return next (createCustomError('All fields are mandatory!',400))
    }
    const contact = await Contact.create({
        name,
        phone,
        email,
        user_id: req.user.id
    })
    res.status(201).json( contact )
})

//@desc Get a contact
//@route GET /api/contacts/:id
//@access Private
const getContact = expressAsyncHandler (async (req, res,next) => {
    const contact = await Contact.findById(req.params.id)
    if(!contact) {
        return next(createCustomError('Contact Not Found!', 404))
    }
    res.status(200).json(contact)
})

//@desc Update contact
//@route PUT /api/contacts/:id
//@access Private
const updateContact = expressAsyncHandler (async (req, res,next) => {
    console.log('Data get from the client for updation', req.body)
    const contact = await Contact.findById(req.params.id)
    if(!contact) {
        return next(createCustomError('Contact Not Found!', 404))
    }
    if(contact.user_id !== req.user.id) {
        return next (createCustomError("Can'not update record of other user", 403))
    }
    const updatedContact = await Contact.findByIdAndUpdate(req.params.id, req.body,{ new: true})
    res.status(200).json( updatedContact )
})

//@desc delete contact
//@route DELETE /api/contacts/:id
//@access Private
const deleteContact = expressAsyncHandler (async (req, res, next) => {
    const contact = await Contact.findById(req.params.id)
    if(!contact) {
        return next(createCustomError("User don't have permession to delete record of other user", 404))
    }
    if(contact.user_id.toString() !== req.user.id) {
        return next (createCustomError("User don't have permession to delete record of other user", 403))
    }
    const deleteContact = await Contact.findByIdAndDelete(req.params.id)
    res.status(200).json(deleteContact)
})

module.exports = { getContacts, createContact, getContact, updateContact, deleteContact }