import {Component} from 'react'

import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'

import './index.css'

import SimilarProducts from '../SimilarProductItem'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    displayObject: {},
    similarProductsDisplayList: [],
    count: 1,
    status: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData = async () => {
    this.setState({status: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(`https://apis.ccbp.in/products/${id}`, options)

    if (response.ok === true) {
      const data = await response.json()

      const updatedData = {
        availability: data.availability,
        brand: data.brand,
        description: data.description,
        id: data.id,
        imageUrl: data.image_url,
        price: data.price,
        rating: data.rating,
        similarProducts: data.similar_products,
        style: data.style,
        title: data.title,
        totalReviews: data.total_reviews,
      }
      const updatedSimilarProducts = data.similar_products.map(data1 => ({
        availability: data1.availability,
        brand: data1.brand,
        description: data1.description,
        id: data1.id,
        imageUrl: data1.image_url,
        price: data1.price,
        rating: data1.rating,
        style: data1.style,
        title: data1.title,
        totalReviews: data1.total_reviews,
      }))
      this.setState({
        displayObject: updatedData,
        similarProductsDisplayList: updatedSimilarProducts,
        status: apiStatusConstants.success,
      })
    } else {
      this.setState({status: apiStatusConstants.failure})
    }
  }

  renderList = () => {
    const {displayObject, similarProductsDisplayList, count} = this.state

    return (
      <div>
        <img src={displayObject.imageUrl} alt="product" />
        <div>
          <h1>{displayObject.title}</h1>
          <p>Rs {displayObject.price}/-</p>
          <div className="rating-container">
            <p className="rating">{displayObject.rating}</p>
            <img
              src="https://assets.ccbp.in/frontend/react-js/star-img.png"
              alt="star"
              className="star"
            />
          </div>
          <div>
            <p>{displayObject.totalReviews} Reviews</p>
            <p>{displayObject.description}</p>
            <p>Available:{displayObject.availability}</p>
            <p>Brand:{displayObject.brand}</p>
            <button type="button" onClick={this.increment} data-testid="plus">
              <BsPlusSquare />
              ""
            </button>
            <p>{count}</p>
            <button type="button" onClick={this.decrement} data-testid="minus">
              <BsDashSquare />
              ""
            </button>
          </div>
          <button type="button">Add To Cart</button>
        </div>
        <div>
          <h1>Similar Products</h1>
          <ul>
            {similarProductsDisplayList.map(eachItem => (
              <SimilarProducts details={eachItem} key={eachItem.id} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  continueLearning = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderFailure = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
      />
      <h1>"Product Not Found"</h1>
      <button type="button" onClick={this.continueLearning}>
        Continue Shopping
      </button>
    </div>
  )

  loader = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  increment = () => {
    this.setState(prevState => ({count: prevState.count + 1}))
  }

  decrement = () => {
    const {count} = this.state
    if (count > 1) {
      this.setState(prevState => ({count: prevState.count - 1}))
    } else {
      this.setState({count: 1})
    }
  }

  render() {
    const {status} = this.state

    switch (status) {
      case apiStatusConstants.inProgress:
        return this.loader()

      case apiStatusConstants.success:
        return this.renderList()

      case apiStatusConstants.failure:
        return this.renderFailure()

      default:
        return this.renderList()
    }
  }
}

export default ProductItemDetails
