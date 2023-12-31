import React, { useState, FC, useContext } from "react";

import { Semester, Track } from "../../constants/Track";
import { Course } from "../../types/course";
import { courses } from "../../constants/Course";
import { Avatar, Dialog, FormControl, Select, MenuItem, InputLabel, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material";
import { blue } from "@mui/material/colors";
import { User } from "../../types/user";
import UserContext from "../../context/UserContext";

const Profile: FC/*<IProfile>*/ = (/*{user}*/) => {
  const [open, setOpen] = React.useState(false);
  const [openGenerate, setGenerateOpen] = React.useState(false);
  const userContext = useContext(UserContext);
  const user = userContext.userData!.user;
  const track: Track = userContext.userData!.track;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);

  };

  const handleGenerateClickOpen = () => {
    setGenerateOpen(true);
  };

  const handleGenerateClose = () => {
    setGenerateOpen(false);

  };

  return (

    <div className="container grid grid-cols-4 mx-auto gap-8  p-8">
      <div className="lg:col-span-1 col-span-4 shadow-sm rounded-xl border border-gray-200 px-8 py-8 overflow-hidden">
        <div className="flex flex-col relative ">
          <img src={"https://www.umass.edu/sites/default/files/2023-03/UMass_Seal_Medium_PMS_202_0.png"} className="rounded-lg shadow-lg h-44 w-44 mb-6 object-cover absolute -top-16 -right-16 opacity-5 saturate-0"></img>

          <img className="w-32 h-32 rounded-full object-cover" src={user.avatar} alt="Profile Picture" />

          <h1 className="text-2xl font-bold mt-4">{user.name}</h1>
          <a className="text-sm text-blue-500 underline" href={`mailto:${user.email}`}>{user.email}</a>
          <p className="text-sm mt-4"><strong>Major: </strong> {user.major}</p>
          <p className="text-sm"><strong>Subfield: </strong> {user.subfield}</p>

          <p className="text-sm"><strong>Graduating: </strong> {user.graduation.season} {user.graduation.year}</p>
          <p className="text-sm mt-4"><strong>Bio: </strong> {user.bio}</p>

        </div>
      </div >
      <div className="lg:col-span-3 col-span-4  shadow-sm rounded-xl border border-gray-200 px-8 py-8">
        <div className="flex flex-col">
          <div className="flex flex-row justify-between">
            <h1 className="text-2xl font-bold">Courses</h1>
            <div className="flex flex-row gap-4">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={handleGenerateClickOpen}>Generate Track</button>

              <button className="bg-black text-white px-4 py-2 rounded-lg" onClick={handleClickOpen}>Add Course</button>

            </div>

          </div>

        </div>
        <div className="flex flex-col">

          {
            track.semesters.map((s, i) => {
              const status = getStatus(s);
              return s.classes.map((c, j) => {
                const course = courses.find(k => k.key === c);
                if (course) {
                  return (
                    <div className="mt-4">
                      <h4 className={`${status.color} font-bold`}>{status.status}</h4>

                      <h1 className="text-lg font-semibold"> {course.key + " | "}{course.name} {'(' + course.credits + ' credits)'}</h1>

                      <h5 className="text-md"> By: {course.professors.map(p => p.split('-').map(c => c[0].toUpperCase() + c.substring(1, c.length)).join(' ')).join(', ')}</h5>
                      <p className="text-sm mt-1 text-gray-500"> {course.description.split('.').slice(0, 2).join('.') + "..."}</p>

                    </div>
                  );
                }
                return null;
              });
            }).flat().filter(c => c).reverse()
          }
        </div>
      </div>
      <CourseDialog
        courses={courses}
        user={user}
        open={open}
        onClose={handleClose}
      />
      <GenerateDialog
        user={user}
        open={openGenerate}
        onClose={handleGenerateClose}
      />
    </div >

  );
};

export interface SimpleDialogProps {
  open: boolean;
  courses: Course[];
  user: User,
  onClose: () => void;
}

function CourseDialog(props: SimpleDialogProps) {
  const { onClose, courses, open, user } = props;
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [season, setSeason] = useState<string>('fall');
  const now = new Date();
  const [year, setYear] = useState<number>(now.getFullYear());

  const handleClose = () => {
    setSelectedCourses([]);
    onClose();
  };

  const handleListItemClick = (value: Course) => {
    if (selectedCourses.findIndex(c => c.key === value.key) >= 0) {
      setSelectedCourses(selectedCourses.filter(c => c.key !== value.key));

    } else {
      setSelectedCourses([...selectedCourses, value]);

    }
  };

  const handleSubmit = () => {
    onClose();
  }

  const handleSeasonChange = (season: string) => {
    setSeason(season);
  }

  const handleYearChange = (year: number) => {
    setYear(year);
  }


  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>
        <div className="flex flex-row w-full h-10">
          <h1 className="text-xl font-semibold  pt-4 mb-4 mr-auto">Select Courses</h1>

          <FormControl
          >
            <InputLabel id="season-label">Season</InputLabel>
            <Select

              value={season}
              label="Season"
              className=" h-10"

              onChange={(e) => handleSeasonChange(e.target.value)}
            >
              <MenuItem value={'fall'}>Fall</MenuItem>
              <MenuItem value={'spring'}>Spring</MenuItem>

            </Select>
          </FormControl>
          <div className="w-4" />


          <FormControl >
            <InputLabel id="year-label">Year</InputLabel>
            <Select

              className=" h-10"
              value={year}
              label="Year"
              onChange={(e) => handleYearChange(e.target.value as number)}
            >
              {
                Array.from({ length: 4 }, (_, i) => user.graduation.year - 3 + i).reverse()
                  .map(y => <MenuItem value={y}>{y}</MenuItem>)
              }

            </Select>
          </FormControl>
        </div>


      </DialogTitle>
      <DialogContent>

        <List sx={{ pt: 0, px: 2 }}>
          {courses.map((course) => {
            const selected = selectedCourses.findIndex(c => c.key === course.key) >= 0;
            return <ListItem className={`border ${selected ? " border-blue-500" : " border-gray-300 "} rounded-lg mt-4 cursor-pointer transition-all`} onClick={() => handleListItemClick(course)}>
              <div>
                <h1 className="text-lg font-semibold"> {course.key + " | "}{course.name} {'(' + course.credits + ' credits)'}{<span className={`float-right ${selected ? 'text-blue-500' : 'opacity-0'}`}> ✓</span>}</h1>
                <h5 className="text-md"> By: {course.professors.map(p => p.split('-').map(c => c[0].toUpperCase() + c.substring(1, c.length)).join(' ')).join(', ')}</h5>
                <p className="text-sm mt-1 text-gray-500"> {course.description.split('.').slice(0, 2).join('.') + "..."}</p>

              </div>

            </ListItem>
          })}

        </List>
      </DialogContent>
      <DialogActions >

        <button className={`bg-blue-500 text-white px-4 py-2 rounded-lg  ` + ((selectedCourses.length > 0) ? 'opacity-100' : 'opacity-0')} onClick={handleSubmit}>Enroll {selectedCourses.length} Courses</button>

      </DialogActions>

    </Dialog>
  );
}

function getSeason(date: Date): string {
  const month = date.getMonth();
  if (month < 3) {
    return "Winter";
  } else if (month < 6) {
    return "Spring";
  } else if (month < 9) {
    return "Summer";
  } else {
    return "Fall";
  }

}

function getStatus(s: any): { status: string, color: string } {
  const now = new Date();
  const planned = (s.year === now.getFullYear() && getSeason(now) !== s.season && s.season === "Fall") || s.year > now.getFullYear();
  const inProgress = s.year === now.getFullYear() && getSeason(now) === s.season;

  if (planned) {
    return { status: "Planned", color: "text-gray-500" };

  } else if (inProgress) {
    return { status: "In Progress", color: "text-blue-500" };
  }
  return { status: "✓ Completed", color: "text-green-500" };
}

function GenerateDialog(props: { open: boolean, user: User, onClose: () => void }) {
  const { onClose, open, user } = props;

  const handleClose = () => {
    onClose();
  };


  const handleSubmit = () => {
    onClose();
  }


  const now = new Date();
  const year = now.getFullYear();
  const season: string = getSeason(now);
  const semNumber = getNumberOfSemester(user.graduation);
  return (
    <Dialog onClose={handleClose} open={open} >

      <DialogTitle>
        <h1 className="text-xl font-semibold mx-auto pt-4">Generate Major Track</h1>
      </DialogTitle>
      <DialogContent>
        <p className="text-sm mt-4"><strong>Major: </strong> {user.major}</p>
        <p className="text-sm"><strong>Subfield: </strong> {user.subfield}</p>

        <p className="text-sm"><strong>Graduating: </strong> {user.graduation.season} {user.graduation.year}</p>
        <p className="text-md mt-2 text-blue-500"><strong> {season} {year}  {' ⟶ '} {user.graduation.season} {user.graduation.year} </strong> </p>

      </DialogContent>
      <DialogActions >
        <button className="bg-black text-white px-4 py-2 rounded-lg" onClick={handleSubmit}>Plan {semNumber} Semester{semNumber > 1 ? 's' : ''}</button>


      </DialogActions>

    </Dialog>
  );
}

function getNumberOfSemester(s: { year: number, season: string }): number {
  const now = new Date();
  const year = now.getFullYear();
  const season: string = getSeason(now);
  let sem = s.year - year;

  if (s.season === "Fall" && season === "Spring") {
    sem += 1;
  }
  return sem - 1;
}

export default Profile;