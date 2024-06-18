import styles from "./Login.module.css"
import { useForm } from "react-hook-form"
import axios from "axios"
import {toast} from "react-toastify"
import bcrypt from "bcryptjs-react"

const Login = () => {

    if(localStorage.getItem("session")) window.location.href = "/etablissements"

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm()

    const onSubmit = (data) => {
        axios.post(`${import.meta.env.VITE_API_URL}/users/login`, data).then(res => {
            localStorage.setItem("session", JSON.stringify({user: res.data.data, token: res.data.token}))
            window.location.href = "/etablissements"
        }).catch(e => {
            toast(e.response.data.error, {type: "error"})
        })
    }

    return(
        <div className={styles.container}>
            <a href="/">&#x2190; Accueil</a>
            <div>
                <h1>Se connecter</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input type="email" {...register("email")} placeholder="Adresse e-mail ..." />
                    <input type="password" {...register("password")} placeholder="Mot de passe ..." />
                    <input type="submit" value="Se connecter" />
                </form>
                <a href="/register">Pas encore inscrit ?</a>
            </div>
        </div>
    )
}

export default Login