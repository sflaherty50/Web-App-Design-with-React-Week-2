import React from 'react';
import axios from 'axios';

import ReactStars from "react-rating-stars-component";

import List from './List.js';
import Form from './Form.js';



class MovieCard extends React.Component {
    state = {
        movieData: {},
        reviews: [
            {
                rating: 3,
                name: 'Danny Boggs',
                review: 'Frozen feels like its breaking new ground in telling a story where the women are actually in control, and where the clichs of their narratives are turned inside out, almost as a sly commentary on what has come before.',
                date: new Date(new Date().setDate(new Date().getDate() - 10))
            },
            {
                rating: 4,
                name: 'David Buster',
                review: 'The story occasionally transforms around the musical numbers, but theyre of notably momentous design.',
                date: new Date()
            }
        ],
        validation: '',
    };

    
  
    componentDidMount() {
        axios
            .get(
                `https://www.omdbapi.com/?apikey=756abb2f&i=${
                    this.props.movieID
                }&plot=full`
            )
            .then(res => res.data)
            .then(res => {
                this.setState({ movieData: res });
            });
    }

    componentWillMount()
    {
        this.setState({
            ...this.state, averageRating: this.getAverageRating(this.state.reviews)
        });
    }
  
    render() {
        const {
            Title,
            Released,
            Genre,
            Plot,
            Poster,
            imdbRating
        } = this.state.movieData;
  
        if (!Poster || Poster === 'N/A') {
            return null;
        }

        const starrating = {
            size: 40,
  count: 7,
  isHalf: false,
  value: 4,
  color: "blue",
  activeColor: "red",
  onChange: newValue => {
    console.log(`Example 3: new value is ${newValue}`);
  }
          };
  
        return (
            <div>
            <div className="movie-card-container">
                <div className="image-container">
                    <div
                        className="bg-image"
                        style={{ backgroundImage: `url(${Poster})` }}
                    />
                </div>
                <div className="movie-info">
                    <h2>Movie Details</h2>
                    <div>
                        <h1>{Title}</h1>
                        <small>Released Date: {Released}</small>
                    </div>
                    <h4>Rating: {imdbRating} / 10</h4>
                    <p>{Plot && Plot.substr(0, 350)}</p>
                    <div className="tags-container">
                        {Genre && Genre.split(', ').map(g => <span>{g}</span>)}
                    </div>
                    <div className="movie-rating"> <ReactStars {...starrating} /></div>
                </div>
               
            </div>
            <div>
            <div className="bg-light-gray global-padding-bottom">
                <section className="reviews">

                    <header className="hero bg-black text-color-white global-padding-vertical overlay">
                        <div className="area align-center text-center row">
                            <h1 className="small-12 medium-6 columns">
                                <span className="font-weight-regular">Reviews</span><br />
                                <span className="font-size-xxlarge text-uppercase"></span>
                            </h1>
                        </div>
                    </header>

                    <div className="row align-center content-margin-top-negative">
                        <div className="small-12 medium-8 large-6 columns">
                            <div className="content-padding bg-white area">
                                <p className="font-size-medium">
                                    Thank you for your review.
                                    <strong className="text-color-primary"></strong>
                                </p>

                                {this.renderList()}
                            </div>
                            {this.renderForm()}
                        </div>
                    </div>


                </section>
            </div>
            </div>
                
            </div>
        );
    }

    renderList()
    {
        return <List reviews={this.state.reviews}/>;
    }

    renderForm()
    {
        return <Form submitForm={this.submitForm} validation={this.state.validation}/>;
    }

    submitForm(event)
    {
        event.preventDefault();
        const reviews = this.state.reviews.slice();

        if(event.target.rating.value === '' || event.target.name.value === '' || event.target.review.value === '') {
            this.setState({
                ...this.state,
                validation: <div className="validation">Niet alle velden zijn ingevuld</div>
            });

            return;
        }

        this.setState({
            ...this.state,
            validation: ''
        });

        reviews.push({
            rating: parseInt(event.target.rating.value),
            name: event.target.name.value,
            review: event.target.review.value,
            date: new Date()
        });

        this.setState({
            ...this.state,
            reviews: reviews,
            averageRating: this.getAverageRating(reviews),
            validation: ''
        });
    }

    getAverageRating(reviews)
    {
        var totalRating = 0;

        reviews.map(function (review)
        {
            totalRating = totalRating + review.rating;
        });

        return Math.round(totalRating / reviews.length * 2 * 10) / 10;
    }
  }

  export default MovieCard;