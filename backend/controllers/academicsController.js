const prisma = require("../config/db.config");

const getSemesters = async (req, res) => {
  try {
    const semesters = await prisma.semester.findMany();
    res.json(semesters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getSubjects = async (req, res) => {
  const { semesterId } = req.params;
  try {
    const subjects = await prisma.subject.findMany({
      where: { semesterId: parseInt(semesterId) },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            designation: true,
            department: true,
          }
        },
        labTeacher: {
          select: {
            id: true,
            name: true,
            designation: true,
            department: true,
          }
        }
      }
    });
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getSemesterDetails = async (req, res) => {
  const { semesterId } = req.params;
  try {
    const subjects = await prisma.subject.findMany({
      where: { semesterId: parseInt(semesterId) },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            designation: true,
            department: true,
          }
        }
      }
    });
    res.json({
      semesterId: parseInt(semesterId),
      subjects,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getSemesters, getSubjects, getSemesterDetails };
