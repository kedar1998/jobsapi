const Job = require('../models/Job')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, UnauthenticatedError, NotFoundError} = require('../errors')

const getAllJobs = async (req,res) =>{

    const jobs = await Job.find({createdby: req.user.userId})

    res.status(StatusCodes.OK).json({
        count: jobs.length,
        jobs
    })
}

const getJob = async (req,res) =>{
    const job = await Job.findOne({_id: req.params.id, createdby: req.user.userId})

    res.status(StatusCodes.OK).json({
        job
    })
}

const createJob = async (req,res) =>{
    req.body.createdby = req.user.userId
    const job = await Job.create(req.body)

    res.status(StatusCodes.CREATED).json({
        job
    })
}

const updateJob = async (req,res) =>{
    const {company, position} = req.body
    const {userId} = req.user
    const {id} = req.params

    if(company === '' || position === ''){
        throw new BadRequestError('Company or Position fields cannot be empty')
    }

    const job = await Job.findByIdAndUpdate({_id: id, createdby: userId}, req.body, {
        new: true,
        runValidators: true
    })

    if(!job){
        throw new NotFoundError('No Job with given id')
    }

    res.status(StatusCodes.OK).json({
        job
    })

}


const deleteJob = async (req,res) =>{
    const {userId} = req.user
    const {id} = req.params

    const job = await Job.findByIdAndDelete({_id: id, createdby: userId})

    res.status(StatusCodes.OK).json({
        msg: "Success"
    })
}

module.exports = {getAllJobs, getJob, createJob, updateJob, deleteJob}