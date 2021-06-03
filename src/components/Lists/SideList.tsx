import React from 'react';
import Skeleton from 'react-loading-skeleton';
import styles from './SideList.module.scss';

type props = {
    title: string,
    listItems: React.ReactNode[] | null;
}

const SideList: React.FC<props> = ({ title, listItems }) => {
    return (
        <>
            {listItems ?
                <div className={styles.SideList}>
                    <h4>{title}</h4>
                    {listItems.length ?
                        <ul>{listItems.slice(0, 12)}</ul>
                        :
                        <small>{"No availble items to show"}</small>}
                </div>
                :
                <div className={styles.SideList}>
                    <h4><Skeleton width="50%" /></h4>
                    <ul style={{ listStyle: "none" }}>
                        {Array(12).fill(true).map((i, index) => <li key={index}><Skeleton width="50%" /></li>)}
                    </ul>
                </div>
            }
        </>
    )
}

export default SideList;