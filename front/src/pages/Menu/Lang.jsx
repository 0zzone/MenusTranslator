import styles from "./Menu.module.css"
import { useState } from "react"

const Lang = ({lang, setLang}) => {

    const [display, setDisplay] = useState(false)

    const langs = ["FR", "GB", "ES", "CN", "KR", "JP", "DE", "PT", "IT"]

    const changeLang = (lg) => {
        setLang(lg)
        setDisplay(false)
    }

    return(
        <div className={styles.bigContainerLang}>


            {display && <div className={styles.dropdown}>
                {langs.filter(lg => lang != lg).map((lang, index) => (
                    <div key={index} className={styles.line} onClick={() => changeLang(lang)}>
                        <img src={`https://flagsapi.com/${lang}/flat/64.png`} />
                        <p>{lang}</p>
                    </div>
                ))}
            </div>}

            <div className={styles.containerLang} onClick={() => setDisplay(!display)}>
                <img src={`https://flagsapi.com/${lang}/flat/64.png`} />
                <p>{lang} &#x2193;</p>
            </div>
        </div>
    )
}

export default Lang