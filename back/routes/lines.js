var express = require('express');
var router = express.Router();
require("dotenv").config()
const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient()

router.post("/create", async (req, res) => {
    const {name, price=null, id_section} = req.body
    try{

        const line = await prisma.line.create({
            data: {
                name,
                price: price ? parseFloat(price) : null,
                id_section: parseInt(id_section)
            }
        })

        return res.status(200).json({data: line})

    } catch(e) {
        return res.status(400).json({error: "Une erreur s'est produite"})
    }
})

router.post('/delete/:id_line', async (req, res) => {
    const {id_line} = req.params
    try{
        const line = await prisma.line.delete({
            where: {
                id_line: parseInt(id_line)
            }
        })

        return res.status(200).json({data: line})

    } catch(e) {
        return res.status(400).json({error: "Une erreur s'est produite"})
    }
})

router.post("/update/:id_line", async (req, res) => {
    const {id_line} = req.params
    const {name=null, price=null} = req.body
    try{
        const line = await prisma.line.update({
            where: {
                id_line: parseInt(id_line)
            },
            data: {
                name: name,
                price: parseFloat(price)
            }
        })

        return res.status(200).json({data: line})

    } catch(e) {
        return res.status(400).json({error: "Une erreur s'est produite"})
    }
})

module.exports = router;