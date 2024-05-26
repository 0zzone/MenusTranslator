var express = require('express');
var router = express.Router();
require("dotenv").config()
const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient()

router.post("/create", async (req, res) => {
    const {name, owner_id} = req.body

    try{
        const etablissement = await prisma.etablissement.create({
            data: {
                name,
                owner_id
            }
        })

        return res.status(200).json({data: etablissement})

    } catch(e) {
        return res.status(400).json({error: "Une erreur s'est produite"})
    }
})

router.get("/:id", async (req, res) => {
    const {id} = req.params
    try{
        const data = await prisma.etablissement.findUnique({
            where: {
              id_etablissement: parseInt(id)
            },
            include: {
                sections: {
                    include: {
                        lines: true
                    }
                }
            }
        })

        return res.status(200).json({data})

    } catch(e) {
        return res.status(400).json({error: "Une erreur s'est produite"})
    }
})



module.exports = router;