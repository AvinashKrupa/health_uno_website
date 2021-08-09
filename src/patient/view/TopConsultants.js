import DoctorCard from "../commonComponentPatient/DoctorCard";
import { Row, Col} from "react-bootstrap";
import {API, get, post} from '../../api/config/APIController';
import { useEffect } from "react";
import {useToasts} from 'react-toast-notifications';
import { useState } from "react";
import {Link} from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import useSearchStore from './../store/searchStore';
import SearchInputWithIcon from '../../commonComponent/SearchInputWithIcon';


const TopConsultants = (props) => {
  let timer = null;
  const { addToast } = useToasts();
  let [searchText, setSearchText] = useState(useSearchStore(state => state.searchText));
  let [consultants, setConsultant] = useState([]);

  useEffect(() => {
    getTopConsultants();
  }, [searchText]);

  function getTopConsultants() {
    let params = {
      limit: 10,
      page: 1,
      filter: {
        text: searchText,
        fee_min: '',
        fee_max: '',
        exp: '',
        lang: '',
      },
      sort_order: '',
      sort_key: 'first_name',
    };
    post(API.GETTOPCONSULTANT, params)
      .then(response => {
       
        if (response.status === 200) {
          setConsultant(response.data.data.docs);
        } else {
          addToast(response.data.message, { appearance: "error" });
        }
      })
      .catch(error => {
        addToast(error.response.data.message, { appearance: "error" });
      });
  }

  function debounce(txt) {
      clearTimeout(timer);
      timer = setTimeout(function() {
        setSearchText(txt);
      }, 1000);
  }


  return (
    <div>
      <Row className='top-consultants-container'>
        <Col lg="1" sm="1" xs='1' />
        <Col lg="10" sm="10" xs='10'>
          <Row className='back-navigation'>
            <Link to='/patient/home'><i class="fas fa-arrow-left"></i><span>Top Consultants</span></Link>
          </Row>
          <Row className='search-container'>
            <SearchInputWithIcon
              placeholder="Search doctors"
              defaultValue={searchText}
              className='patient-homepage-search'
              onChange={(e) => debounce(e)}
            >
            </SearchInputWithIcon>
          </Row>
         
          <Row style={{display: 'flex', flexDirection: 'row'}} className='top-consultants-card-container'>
          {consultants.map((consultant) => {
              return(
                <Grid container item lg={4}  md={6} sm={6} xs={12} spacing={1}>
                  <DoctorCard
                    image={consultant.dp}
                    name={`${consultant.first_name}, ${consultant.last_name}`}
                    fees={consultant.fee}
                    details={`${consultant.city}, ${consultant.country} | ${consultant.exp} Y Exp`}
                    qualifications={consultant.specialities}
                  />
                </Grid>
              )
            })}
          </Row>
        </Col>
        <Col lg="1" sm="1" xs='1'/>
      </Row>
    </div>
  );
};

export default TopConsultants;  
