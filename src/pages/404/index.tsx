import React from 'react';
import styles from './NotFound.module.scss';

const index: React.FC = () => {
    return (
        <div className={"container"}>
            <div className={styles.notFound}>
                <h1>404 - Page Not Found</h1>
            </div>
        </div>
    )
}

export default index;