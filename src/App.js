import React from "react";
import "./App.css";
import Sidebar from "./Sidebar";
import CourseArea from "./CourseArea";
import PrevCourseArea from "./PrevCourseArea";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allCourses: [],
      completedCourses: [],
      filteredCourses: [],
      subjects: [],
      keywords: [],
      interests: [],
      cartCourses: {},
      recommendedCourses: {},
      loading: true,
    };
  }

  componentDidMount() {
    this.loadInitialState();
  }

  async loadInitialState() {
    let courseURL = "https://avigael-course-api.herokuapp.com/courses/";
    let completeURL = "https://avigael-course-api.herokuapp.com/courses/completed/";
    let courseData = await (await fetch(courseURL)).json();
    let completeData = await (await fetch(completeURL)).json();

    this.setState({
      allCourses: courseData,
      completedCourses: completeData,
      filteredCourses: courseData,
      subjects: this.getSubjects(courseData),
      keywords: this.getKeywords(courseData),
      loading: false,
    });
  }

  getSubjects(data) {
    let subjects = [];
    subjects.push("All");

    for (let i = 0; i < data.length; i++) {
      if (subjects.indexOf(data[i].subject) === -1)
        subjects.push(data[i].subject);
    }

    return subjects;
  }

  getKeywords(data) {
    let keywords = [];
    keywords.push("All");

    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].keywords.length; j++) {
        if (keywords.indexOf(data[i].keywords[j]) === -1)
          keywords.push(data[i].keywords[j]);
      }
    }

    return keywords;
  }

  setCourses(courses) {
    this.setState({ filteredCourses: courses });
  }

  addCartCourse(data) {
    let newCartCourses = JSON.parse(JSON.stringify(this.state.cartCourses)); // I think this is a hack to deepcopy
    let courseIndex = this.state.allCourses.findIndex((x) => {
      return x.number === data.course;
    });
    if (courseIndex === -1) {
      return;
    }

    if ("subsection" in data) {
      if (data.course in this.state.cartCourses) {
        if (data.section in this.state.cartCourses[data.course]) {
          newCartCourses[data.course][data.section].push(data.subsection);
        } else {
          newCartCourses[data.course][data.section] = [];
          newCartCourses[data.course][data.section].push(data.subsection);
        }
      } else {
        newCartCourses[data.course] = {};
        newCartCourses[data.course][data.section] = [];
        newCartCourses[data.course][data.section].push(data.subsection);
      }
    } else if ("section" in data) {
      if (data.course in this.state.cartCourses) {
        newCartCourses[data.course][data.section] = [];

        for (
          let i = 0;
          i <
          this.state.allCourses[courseIndex].sections[data.section].subsections
            .length;
          i++
        ) {
          newCartCourses[data.course][data.section].push(
            this.state.allCourses[courseIndex].sections[data.section]
              .subsections[i]
          );
        }
      } else {
        newCartCourses[data.course] = {};
        newCartCourses[data.course][data.section] = [];
        for (
          let i = 0;
          i <
          this.state.allCourses[courseIndex].sections[data.section].subsections
            .length;
          i++
        ) {
          newCartCourses[data.course][data.section].push(
            this.state.allCourses[courseIndex].sections[data.section]
              .subsections[i]
          );
        }
      }
    } else {
      newCartCourses[data.course] = {};

      for (
        let i = 0;
        i < this.state.allCourses[courseIndex].sections.length;
        i++
      ) {
        newCartCourses[data.course][i] = [];

        for (
          let c = 0;
          c < this.state.allCourses[courseIndex].sections[i].subsections.length;
          c++
        ) {
          newCartCourses[data.course][i].push(
            this.state.allCourses[courseIndex].sections[i].subsections[c]
          );
        }
      }
    }
    this.setState({ cartCourses: newCartCourses });
  }

  addSubjectCart(data) {
    let newCartCourses = JSON.parse(
      JSON.stringify(this.state.recommendedCourses)
    );

    this.state.allCourses.map((element) => {
      if (element.subject === data.course) {
        newCartCourses[element.number] = {};

        for (let i = 0; i < element.sections.length; i++) {
          newCartCourses[element.number][i] = [];

          for (let c = 0; c < element.sections[i].subsections.length; c++) {
            newCartCourses[element.number][i].push(
              element.sections[i].subsections[c]
            );
          }
        }
      }
    });

    this.setState({ recommendedCourses: newCartCourses });
  }

  removeSubjectCart(data) {
    let newCartCourses = JSON.parse(
      JSON.stringify(this.state.recommendedCourses)
    );

    this.state.allCourses.map((element) => {
      if (element.subject === data.course){
        delete newCartCourses[element.number];
      }
    });
    this.setState({ recommendedCourses: newCartCourses });
  }

  removeCartCourse(data) {
    let newCartCourses = JSON.parse(JSON.stringify(this.state.cartCourses));

    if ("subsection" in data) {
      newCartCourses[data.course][data.section].splice(
        newCartCourses[data.course][data.section].indexOf(data.subsection),
        1
      );
      if (newCartCourses[data.course][data.section].length === 0) {
        delete newCartCourses[data.course][data.section];
      }
      if (Object.keys(newCartCourses[data.course]).length === 0) {
        delete newCartCourses[data.course];
      }
    } else if ("section" in data) {
      delete newCartCourses[data.course][data.section];
      if (Object.keys(newCartCourses[data.course]).length === 0) {
        delete newCartCourses[data.course];
      }
    } else {
      delete newCartCourses[data.course];
    }
    this.setState({ cartCourses: newCartCourses });
  }

  getCartData() {
    let cartData = [];

    for (const courseKey of Object.keys(this.state.cartCourses)) {
      let course = this.state.allCourses.find((x) => {
        return x.number === courseKey;
      });

      cartData.push(course);
    }
    return cartData;
  }

  getRecommended() {
    let cartData = [];

    for (const courseKey of Object.keys(this.state.recommendedCourses)) {
      let course = this.state.allCourses.find((x) => {
        return x.number === courseKey;
      });

      cartData.push(course);
    }
    return cartData;
  }

  render() {
    return (
      <>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossOrigin="anonymous"
        />

        <Tabs
          defaultActiveKey="search"
          style={{
            position: "fixed",
            zIndex: 1,
            width: "100%",
            backgroundColor: "white",
          }}
        >
          <Tab eventKey="search" title="Search" style={{ paddingTop: "5vh" }}>
            <Sidebar
              setCourses={(courses) => this.setCourses(courses)}
              courses={this.state.allCourses}
              subjects={this.state.subjects}
              keywords={this.state.keywords}
            />
            <div style={{ marginLeft: "20vw", paddingTop: "8px"}}>
              <CourseArea
                data={this.state.filteredCourses}
                addCartCourse={(data) => this.addCartCourse(data)}
                removeCartCourse={(data) => this.removeCartCourse(data)}
                cartCourses={this.state.cartCourses}
                completed={this.state.completedCourses}
                interests={false}
                loading={this.state.loading}
              />
            </div>
          </Tab>
          <Tab eventKey="cart" title="Cart" style={{ paddingTop: "5vh" }}>
            <div style={{ marginLeft: "20vw", paddingTop: "8px"}}>
              <CourseArea
                data={this.getCartData()}
                setCourses={(courses) => this.setCourses(courses)}
                addCartCourse={(data) => this.addCartCourse(data)}
                removeCartCourse={(data) => this.removeCartCourse(data)}
                cartCourses={this.state.cartCourses}
                completed={this.state.completedCourses}
                interests={false}
                loading={this.state.loading}
              />
            </div>
          </Tab>
          <Tab
            eventKey="completed"
            title="Completed Courses"
            style={{ paddingTop: "5vh" }}
          >
            <div style={{ marginLeft: "20vw", paddingTop: "8px" }}>
              <PrevCourseArea
                data={this.state.filteredCourses}
                completed={this.state.completedCourses}
                addSubjectCart={(data) => this.addSubjectCart(data)}
                removeSubjectCart={(data) => this.removeSubjectCart(data)}
                allCourses={this.state.allCourses}
              />
            </div>
          </Tab>

          <Tab
            eventKey="recommended"
            title="Recommended Courses"
            style={{ paddingTop: "5vh" }}
          >
            <div style={{ marginLeft: "20vw", paddingTop: "8px"}}>
              <CourseArea
                data={this.getRecommended()}
                addCartCourse={(data) => this.addCartCourse(data)}
                removeCartCourse={(data) => this.removeCartCourse(data)}
                cartCourses={this.state.cartCourses}
                completed={this.state.completedCourses}
                interests={true}
                loading={this.state.loading}
              />
            </div>
          </Tab>
        </Tabs>
      </>
    );
  }
}

export default App;
