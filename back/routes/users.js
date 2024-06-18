var express = require('express');
var router = express.Router();
require("dotenv").config()
const bcrypt = require('bcryptjs');
const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient()
const authenticateToken = require("./middleware")
const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');

router.post('/create', async (req, res) => {
    const {email, firstName, lastName, password, subscription} = req.body
    try {
        const user_already = await prisma.user.findFirst({
            where: {
                email
            }
        })

        if(user_already != null){
            return res.status(400).json({error: "L'utilisateur existe déjà !"})
        }

        const user = await prisma.user.create({
            data: {
                email, firstName, lastName, password, subscription
            }
        })
    
        const token = jwt.sign({ email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '10h' });

        return res.status(200).json({data: user, token})

    } catch(e){
        return res.status(400).json({error: "Une erreur s'est produite"})
    }

});

router.post("/login", async (req, res) => {
    const {email, password} = req.body
    try {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(isPasswordValid) {
            const token = jwt.sign({ email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '10h' });
            return res.status(200).json({data: user, token })
        } else {
            return res.status(400).json({error: "Email ou mot de passe incorect"})
        }
    } catch(e) {
        return res.status(400).json({error: "Une erreur s'est produite"})
    }
})

router.get('/get/:email', authenticateToken, async (req, res) => {
    const {email} = req.params
    try{
        const user = await prisma.user.findUnique({
            where: {
                email
            },
            include: {
                etablissements: true
            }
        })


        return res.status(200).json({data: user})

    } catch(e) {
        return res.status(400).json({error: "Une erreur s'est produite"})
    }
})

router.post("/update/:id_user/:price_id", authenticateToken, async (req, res) => {

    const {id_user, price_id} = req.params

    try {
        const user = await prisma.user.update({
            where: {
                id_user: parseInt(id_user)
            },
            data: {
                subscription: price_id
            }
        })
    
        return res.status(200).json({data: user})

    } catch(e) {
        return res.status(400).json({error: "Une erreur s'est produite"})
    }
})

router.post("/search", authenticateToken, async (req, res) => {

    if(req.user.role !== "ADMIN") {
        return res.status(403).json({error: "Vous n'êtes pas autorisé à accéder à cette page !"})
    }

    const {name} = req.body
    try {
        const resultSearch = await prisma.user.findMany({
            where: {
                OR: [
                    {email: {contains: name}},
                    {firstName: {contains: name}},
                    {lastName: {contains: name}},
                ]
            },
            include: {
                etablissements: true
            }
        })

        console.log(resultSearch)

        return res.status(200).json({data: resultSearch})

    } catch(e) {
        return res.status(400).json({error: "Une erreur s'est produite"})
    }
})


module.exports = router;
