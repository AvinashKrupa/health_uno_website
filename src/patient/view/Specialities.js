import { Row, Col} from "react-bootstrap";
import {API, get} from '../../api/config/APIController';
import { useEffect } from "react";
import {useToasts} from 'react-toast-notifications';
import { useState } from "react";
import {Link} from 'react-router-dom';
import useSearchStore from './../store/searchStore';
import SpecialityCard from "../commonComponentPatient/SpecialityCard";
import SearchInputWithIcon from '../../commonComponent/SearchInputWithIcon';


const Specialities = (props) => {
  let timer = null;
  const { addToast } = useToasts();
  let [searchText, setSearchText] = useState(useSearchStore(state => state.searchText));
  const [specialities, setSpecialities] = useState([]);

  useEffect(() => {
    getSpecialization();
  }, []);

  function getSpecialization() {
    get(API.GETSPECIALITIES)
      .then(response => {
        if (response.status === 200) {
          setSpecialities(response.data.data);
        } else {
          addToast(response.data.message, { appearance: 'error' });
        }
      })
      .catch(error => {
        addToast(error.response.data.message, { appearance: 'error' });
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
              defaultValue={searchText}
              placeholder="Search doctors"
              className='patient-homepage-search'
              onChange={(e) => debounce(e)}
            >
            </SearchInputWithIcon>
          </Row>
          <Row style={{ marginTop: "42px", marginBottom: "32px" }}>
            <Col>
              <span className="patient-homepage-text-h4">Specialities</span>
            </Col>
            <Col style={{ textAlign: "right" }}>
              <span className="patient-homepage-link-text ">View All</span>
            </Col>
          </Row>
          <Row>
            {specialities.map((specialitie) => {
              return (
                <SpecialityCard
                  icon={specialitie.image}
                  label={specialitie.title}
                  setSearchText={debounce}
                />
              );
            })}
          </Row>
        </Col>
        <Col lg="1" sm="1" xs='1'/>
      </Row>
    </div>
  );
};

export default Specialities;  
