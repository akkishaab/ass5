// AboutJobItem.js
import React, {Component} from 'react'
import Cookies from 'js-cookie'
import {MdLocationOn} from 'react-icons/md'
import {AiFillStar} from 'react-icons/ai'
import {BiLinkExternal} from 'react-icons/bi'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import SimilarJobs from '../SimilarJobs'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class AboutJobItem extends Component {
  state = {
    jobDataDetails: [],
    similarJobsData: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobData()
  }

  getJobData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')
    const jobDetailsApiUrl = `https://apis.ccbp.in/jobs/${id}`
    const optionsJobData = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }

    try {
      const responseJobData = await fetch(jobDetailsApiUrl, optionsJobData)

      if (responseJobData.ok === true) {
        const fetchedJobData = await responseJobData.json()
        const updatedJobDetailsData = [fetchedJobData.job_details].map(
          eachItem => ({
            companyLogoUrl: eachItem.company_logo_url,
            companyWebsiteUrl: eachItem.company_website_url,
            employmentType: eachItem.employment_type,
            id: eachItem.id,
            jobDescription: eachItem.job_description,
            lifeAtCompany: {
              description: eachItem.life_at_company.description,
              imageUrl: eachItem.life_at_company.image_url,
            },
            location: eachItem.location,
            packagePerAnnum: eachItem.package_per_annum,
            rating: eachItem.rating,
            skills: eachItem.skills.map(eachSkill => ({
              imageUrl: eachSkill.image_url,
              name: eachSkill.name,
            })),
            title: eachItem.title,
          }),
        )

        const updatedSimilarJobDetails = fetchedJobData.similar_jobs.map(
          eachItem => ({
            companyLogoUrl: eachItem.company_logo_url,
            id: eachItem.id,
            jobDescription: eachItem.job_description,
            employmentType: eachItem.employment_type,
            location: eachItem.location,
            rating: eachItem.rating,
            title: eachItem.title,
          }),
        )

        this.setState({
          jobDataDetails: updatedJobDetailsData,
          similarJobsData: updatedSimilarJobDetails,
          apiStatus: apiStatusConstants.success,
        })
      } else {
        this.setState({
          apiStatus: apiStatusConstants.failure,
        })
      }
    } catch (error) {
      console.error('Error fetching job data: ', error)
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderJobDetailsSuccessView = () => {
    const {jobDataDetails, similarJobsData} = this.state

    if (jobDataDetails.length >= 1) {
      const {
        companyLogoUrl,
        companyWebsiteUrl,
        employmentType,
        id,
        jobDescription,
        lifeAtCompany,
        location,
        packagePerAnnum,
        rating,
        skills,
        title,
      } = jobDataDetails[0]

      return (
        <div className="job-item-container">
          <div className="first-part-container">
            <div className="img-title-container">
              <img
                className="company-logo"
                src={companyLogoUrl}
                alt="job details company logo"
              />
              <div className="title-rating-container">
                <h1 className="title-heading">{title}</h1>
                <div className="star-rating-container">
                  <AiFillStar className="star-icon" />
                  <p className="rating-text">{rating}</p>
                </div>
              </div>
            </div>
            <div className="location-package-container">
              <div className="location-job-type-container">
                <div className="location-icon-location-container">
                  <MdLocationOn className="location-icon" />
                  <p className="location-job">{location}</p>
                </div>
                <div className="employment-type-icon-employment-type-container">
                  <p className="job-type">{employmentType}</p>
                </div>
              </div>
              <div className="package-container">
                <p className="package">{packagePerAnnum}</p>
              </div>
            </div>
          </div>
          <hr className="item-hr-line" />
          <div className="second-part-container">
            <div className="description-visit-container">
              <h1 className="description-job-heading">Description</h1>
              <a className="visit-anchor" href={companyWebsiteUrl}>
                Visit
                <BiLinkExternal className="link-icon" />
              </a>
            </div>
            <p className="description-text">{jobDescription}</p>
          </div>
          <div className="third-part-container">
            <h1 className="life-heading">Life at Company</h1>
            <div className="life-img-desc-container">
              <img
                className="life-img"
                src={lifeAtCompany.imageUrl}
                alt="life at company"
              />
              <p className="life-description">{lifeAtCompany.description}</p>
            </div>
          </div>
          <div className="skills-container">
            <h1 className="skills-heading">Skills</h1>
            <ul className="skills-list">
              {skills.map(eachSkill => (
                <li key={eachSkill.name} className="skill-item">
                  <img
                    className="skill-img"
                    src={eachSkill.imageUrl}
                    alt="skill"
                  />
                  <p className="skill-name">{eachSkill.name}</p>
                </li>
              ))}
            </ul>
          </div>
          <SimilarJobs similarJobsData={similarJobsData} />
        </div>
      )
    }
    return null
  }

  renderJobDetailsFailureView = () => (
    <div className="failure-view-container">
      <h1 className="failure-heading">Something Went Wrong</h1>
      <p className="failure-text">
        We are facing some issues, Please try again after sometime.
      </p>
    </div>
  )

  renderJobDetailsInProgressView = () => (
    <div className="loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderJobDetailsInProgressView()
      case apiStatusConstants.success:
        return this.renderJobDetailsSuccessView()
      case apiStatusConstants.failure:
        return this.renderJobDetailsFailureView()
      default:
        return null
    }
  }
}

export default AboutJobItem
