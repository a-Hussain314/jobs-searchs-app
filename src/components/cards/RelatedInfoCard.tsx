import React from 'react';
import { Link } from 'react-router-dom';
import styles from './RelatedInfoCard.module.scss';
type props = {
    title: string,
    href: string,
    description?: string,
    listData: {
        [item: string]: string | number
    }
}

const RelatedInfoCard: React.FC<props> = React.memo(({ title, description, href, listData }) => {
    return (
        <div className={styles.RelatedInfoCard}>
            <h3 className={styles.title}><Link to={href}>{title}</Link></h3>
            <p className={styles.description}>{description}</p>
            <ul className={styles.ListData}>
                {Object.keys(listData).map((item) => (
                    <li key={item}><b>{item}: </b>{listData[item]}</li>
                ))}
            </ul>
        </div>
    )
})

export default RelatedInfoCard;