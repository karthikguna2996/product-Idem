import './index.css'

import {Link} from 'react-router-dom'

const SimilarProducts = props => {
  const {details} = props
  const {title, brand, price, rating, imageUrl, id} = details
  const topath = `../products/${id}`
  return (
    <Link to={topath}>
      <li>
        <img src={imageUrl} alt="similar product" />
        <h1>{title}</h1>
        <p>by {brand}</p>
        <p>by {price}</p>
        <div className="rating-container">
          <p className="rating">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star"
          />
        </div>
      </li>
    </Link>
  )
}

export default SimilarProducts
