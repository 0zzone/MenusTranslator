var express = require('express');
var router = express.Router();
require("dotenv").config()
const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient()
const authenticateToken = require("./middleware")

router.post("/create", authenticateToken, async (req, res) => {
    const {name, price=null, id_etablissement, rank} = req.body

    try{
        const section = await prisma.section.create({
            data: {
                name,
                price: price ? parseFloat(price) : null,
                id_etablissement: parseInt(id_etablissement),
                rank: parseInt(rank)
            }
        })

        return res.status(200).json({data: section})

    } catch(e) {
        return res.status(400).json({error: "Une erreur s'est produite"})
    }
})


router.post("/delete/:id_section", authenticateToken, async (req, res) => {
    const {id_section} = req.params
    try {
        const section = await prisma.section.findUnique({
            where: {
                id_section: parseInt(id_section)
            },
            include: {
                lines: true
            }
        })


        if(section.lines.length > 0){
            return res.status(400).json({error: "La section ne peut pas être supprimée, il reste des lignes"})
        }


        const final_section = await prisma.section.delete({
            where: {
                id_section: parseInt(id_section)
            }
        })

        return res.status(200).json({data: final_section})

    } catch(e) {
        return res.status(400).json({error: "Une erreur s'est produite"})
    }
})

router.post("/update/:id_section", authenticateToken, async (req, res) => {
    const {id_section} = req.params
    const {name=null, price=null, rank} = req.body
    try {
        const section = await prisma.section.update({
            where: {
                id_section: parseInt(id_section)
            },
            data: {
                name,
                price: parseFloat(price),
                rank: parseInt(rank)
            }
        })
    
        return res.status(200).json({data: section})

    } catch(e) {
        return res.status(400).json({error: "Une erreur s'est produite"})
    }
})

module.exports = router;