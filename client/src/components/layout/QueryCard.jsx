import styles from "./ComponentStyle/QueryCard.module.css";

const QueryCard = ({ query }) => {
  return (
    <div className={styles.card}>
      <h3>{query.property?.title}</h3>

      <p className={styles.message}>
        "{query.message}"
      </p>

      <div className={styles.meta}>
        <span>Seller: {query.seller?.name}</span>
        <span>Email: {query.seller?.email}</span>
      </div>

      <div className={styles.date}>
        {new Date(query.createdAt).toLocaleString()}
      </div>
    </div>
  );
};

export default QueryCard;