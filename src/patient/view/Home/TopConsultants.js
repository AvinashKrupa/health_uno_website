import { Row, Col} from "react-bootstrap";
import {API, get, post} from '../../../api/config/APIController';
import { useEffect } from "react";
import {useToasts} from 'react-toast-notifications';
import { useState } from "react";
import Grid from '@material-ui/core/Grid';
import useSearchStore from '../../store/searchStore';
import SearchInputWithIcon from '../../../commonComponent/SearchInputWithIcon';
import TopConsultantsFilter from '../../commonComponentPatient/TopConsultantsFilter'
import { Button } from "react-bootstrap";
import { filter } from "../../../constants/PatientImages";
import SimilarDoctorsCard  from '../doctorDetail/SimilarDoctorsCard'
import { back_icon } from "../../../constants/DoctorImages";
import InfiniteScroll from"react-infinite-scroll-component";
import Label from "../../../commonComponent/Label";

const TopConsultants = (props) => {
  let timer = null;
  const { addToast } = useToasts();
  let [searchText, setSearchText] = useState(useSearchStore(state => state.searchText));
  let [consultants, setConsultant] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchClear, setSearchClear] = useState(false);
  const [page, setPage] = useState(1);
  const [totalConsultants, setTotalConsultants] = useState(0);
  useEffect(() => {
    const searchInput = document.getElementById('top-const-search')
    searchInput.focus();
      getTopConsultants();
  }, [searchText]);


  useEffect(() => {
      document.querySelectorAll('[role="navigation"]').forEach(function (el){
        el.classList.add("filter-list-close");
        });
  }, []);

  function callBackFilter(data) {
    getTopConsultants(data.sortBy, data.min, data.max, data.selectedLanguages, data.experience);
  }

  function getTopConsultants(sortBy = 'asc', min = '100', max = '5000' , lang = [],exp, isPagination = false,) {
    let params = {
      limit: 40,
      page: isPagination ? page : 1,
      filter: {
        text: searchText,
        fee_min: Number(min),
        fee_max: Number(max),
        ...exp && {exp: Number(exp)},
        language: lang,
      },
      sort_order: sortBy,
      sort_key: 'first_name',
    };
    post(API.GETTOPCONSULTANT, params)
      .then(response => {
        if (response.status === 200) {
          setTotalConsultants(response.data.data.total)
          if(isPagination) {
            setPage(page + 1)
            if(page > 1){
              setConsultant([...consultants, ...response.data.data.docs]);
            }else{
              setConsultant(response.data.data.docs);
            }
            } else {
              if(!searchClear){
                setPage(page + 1)
              }
              setConsultant(response.data.data.docs);
          }

        } else {
          addToast(response.data.message, { appearance: "error" });
        }
      })
      .catch(error => {
        addToast(error && error.response && error.response.data && error.response.data.message, { appearance: "error" });
      });
  }


  function debounce(txt) {
    clearTimeout(timer);
    timer = setTimeout(function() {
      if(!txt){
        setSearchClear(true)
      }else{
        setPage(1)
        setSearchClear(false)
      }
      setSearchText(txt);
    }, 1000);
  }

  const toggleSidebar = () => {
    if(sidebarOpen) {
      document.querySelectorAll('[role="navigation"]').forEach(function (el){
        el.classList.add("filter-list-close");
        });
    } else {
      document.querySelectorAll('[role="navigation"]').forEach(function (el){
        el.classList.remove("filter-list-close");
        });
    }

    setSidebarOpen(!sidebarOpen);
  }
  const fetchMoreData = () => {
    if(totalConsultants > consultants.length){
      getTopConsultants('asc','',  '', '' , '', true)
    }
  };
  return (
    <div>
      <TopConsultantsFilter sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} callBackFilter={callBackFilter}/>
      <Row className='top-consultants-container'>
        <Col lg="1"  sm="1" xs='1' />
        <Col lg="10" sm="10" xs='10' className='screen-768'>
          {/* <div className='back-navigation'>
            <button><i class="fas fa-arrow-left" style={{cursor: 'pointer', paddingRight: '27px'}} onClick={() =>  props.history.push('/patient/home')}></i><span>Top Consultants</span></button>
          </div> */}
          <button className="back-nav-container back-navigation">
                    <img src={back_icon} alt='back_icon-img' onClick={() =>  props.history.push('/patient/home')}></img>
                    <span>Top Consultants</span>
          </button>
          <div className='search-container' style={{display: "flex", justifyContent:'space-between,',marginTop:'20px'}}>
            <SearchInputWithIcon
              col='12'
              placeholder="Search doctors"
              defaultValue={searchText}
              className='patient-homepage-search'
              onChange={(e) => debounce(e)}
              id='top-const-search'
            >
            </SearchInputWithIcon>
            <Button onClick={toggleSidebar} style={{marginTop: '33px'}}>
              <img src={filter} alt='filter-img' style={{height: '26px', width: '24px', zIndex: -1}}></img>
            </Button>
          </div>
          <div>
            <InfiniteScroll
              dataLength={consultants.length}
              next={fetchMoreData}
              hasMore={true}
              className="load-data"
            >
              <Row style={{ display: 'flex', flexDirection: 'row' }} className='top-consultants-card-container'>
                {consultants.map((doctor) => {
                  return(
                    <Grid container item lg={4}  md={6} sm={7} xs={12} spacing={1}>
                      <SimilarDoctorsCard
                        id={doctor._id}
                        image={doctor.dp}
                        name={`Dr ${doctor.first_name} ${doctor.last_name}`}
                        fees={doctor.fee}
                        details={`${doctor.city}, ${doctor.country} | ${doctor.exp} Y Exp`}
                        qualifications={doctor.specialities}
                        language={doctor.language}
                      />
                    </Grid>
                  )
                })}
              </Row>
            </InfiniteScroll>
            {consultants.length === 0 &&
               <div className='empty-text'>
                <Label
                    title={'No results found'}
                />
              </div>
            }
          </div>

        </Col>
        <Col lg="1" sm="1" xs='1' />
      </Row>
    </div>
  );
};

export default TopConsultants;
