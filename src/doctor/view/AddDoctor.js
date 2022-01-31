import { Row, Col} from "react-bootstrap";
import {API, get, post} from '../../api/config/APIController';
import React, { useEffect } from "react";
import {useToasts} from 'react-toast-notifications';
import { useState } from "react";
import Grid from '@material-ui/core/Grid';
import useSearchStore from '../store/searchStore';
import addDoctorStore from '../store/addDoctorStore';
import SearchInputWithIcon from '../../commonComponent/SearchInputWithIcon';
import TopConsultantsFilter from '../../patient/commonComponentPatient/TopConsultantsFilter'
import { Button } from "react-bootstrap";
import {back_icon, filter_icon} from "../../constants/DoctorImages";
import SimilarDoctorsCard  from '../../patient/view/doctorDetail/SimilarDoctorsCard'

const AddDoctor = (props) => {
  let timer = null;
  const { addToast } = useToasts();
  let [searchText, setSearchText] = useState(useSearchStore(state => state.searchText));
  let [consultants, setConsultant] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const setAddDoctor = addDoctorStore((state) => state.setAddDoctor);

  useEffect(() => {
    getTopConsultants();
  }, [searchText]);

  const onDoctorSelect = (doctor) => {
    let params = {
      appointment_id: props.match.params.appointment_id,
      doctor_id: doctor.id,
    };
    post(API.ADD_ADDITIONAL_DOCTOR, params)
        .then(response => {
          if (response.status == 200) {
            setAddDoctor(doctor);
            props.history.goBack();
            addToast(response.data.message, { appearance: 'success' })
          } else {
            addToast(response.data.message, {appearance: "error"});
          }
        })
        .catch(error => {
          addToast(error.response.data.message, {appearance: "error"});
        });
  }

  function callBackFilter(data) {
    getTopConsultants(data.sortBy, data.min, data.max, data.selectedLanguages);
  }

  function getTopConsultants(sortBy = 'asc', min = '', max = '' , lang = '') {
    let params = {
      limit: 10,
      page: 1,
      filter: {
        text: searchText,
        fee_min: min,
        fee_max: max,
        exp: '',
        language: lang,
      },
      sort_order: sortBy,
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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  }

  return (
    <TopConsultantsFilter sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} callBackFilter={callBackFilter}>
      <div>
      <Row className='top-consultants-container'>
        <Col lg="1" sm="1" xs='1' />
        <Col lg="10" sm="10" xs='10'>
          <Row className='back-navigation'>
            <div className="back-nav-container-dr">
              <img src={back_icon} alt='back_icon-img' onClick={()=>props.history.goBack()}></img>
              <span>Search doctors</span>
            </div>
          </Row>
          <div className='search-container' style={{display: "flex", justifyContent:'space-between'}}>
            <SearchInputWithIcon
              col='12'
              placeholder="Search doctors"
              defaultValue={searchText}
              className='patient-homepage-search'
              onChange={(e) => debounce(e)}
            >
            </SearchInputWithIcon>
            <Button onClick={toggleSidebar} style={{marginTop: '33px'}}>
              <img src={filter_icon} alt='filter-img' style={{height: '26px', width: '24px'}}></img>
            </Button>
          </div>

          <Row style={{display: 'flex', flexDirection: 'row'}} className='top-consultants-card-container'>
          {consultants.map((doctor) => {
              return(
                <Grid key={doctor._id} container item lg={4}  md={6} sm={6} xs={12} spacing={1}>
                   <SimilarDoctorsCard
                        id={doctor._id}
                        image={doctor.dp}
                        name={`${doctor.first_name} ${doctor.last_name}`}
                        fees={doctor.fee}
                        details={`${doctor.city}, ${doctor.country} | ${doctor.exp} Y Exp`}
                        qualifications={doctor.specialities}
                        from={'doctor'}
                        onDoctorSelect={onDoctorSelect}
                        language={doctor.language}
                  />
                </Grid>
              )
            })}
          </Row>
        </Col>
        <Col lg="1" sm="1" xs='1'/>
      </Row>
    </div>
    </TopConsultantsFilter>

  );
};

export default AddDoctor;
