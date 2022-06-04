const StudentService = require('../services/student')
const ResultService = require('../services/result')
const DepartmentService = require('../services/department')
const FacultyService = require('../services/faculty')

class StudentController {

  static async getStudentsPage(req, res) {
    let students
    if (req.query.search && req.query.search.length > 1) {
      students = await StudentService.findByName(req.query.search) 
    } else {
      students = await StudentService.findAll()
    }
    res.render('students', {students})
  }
 
  static async createStudentPage(req, res) {
    let faculties = await FacultyService.findAll()
    let departments = await DepartmentService.findAll()
    res.render('students-new', { departments, faculties })
  }

  static async createStudent(req, res) {
    let dao = req.body
    try {
      await StudentService.create(dao)
      res.redirect('/students')
    } catch (err) {
      console.log(err)
      res.redirect('/students')
    }
  }

  static async gotoGetResult(req, res) {
    res.render('goto-get-result')
  }

  static async handleGetResult(req, res) {
    try {
      let student = await StudentService.findByRegNo(req.query.student_reg_no)
      let result = await ResultService.findByStudentRegNo(req.query.student_reg_no)
      res.render('students-result', {student, result})
    } catch (error) {
      console.log(err)
      req.flash('error_msg', 'Last Operation Failed')
      res.redirect('/students')
    }
  }

  static async getComputeResult(req, res) {
    try {
      let student = await StudentService.findById(req.query.student_id)
      res.render('compute-result', {student})
    } catch (error) {
      console.log(err)
      req.flash('error_msg', 'Last Operation Failed')
      res.redirect('/students')
    }
  }

  static async computeResult(req, res) {
    let dao = req.body
    try {
      let result = await ResultService.findByStudentRegNo(dao.student_reg_no)
      if (! result) {
        await ResultService.create(dao)
      } else {
        result.level_1_cgpa = dao.level_1_cgpa
        result.level_2_cpga = dao.level_2_cpga
        await result.save()
      }
      req.flash('success_msg', 'Success')
      res.redirect('/students')
    } catch (error) {
      console.log(error)
      req.flash('error_msg', 'Last Operation Failed')
      res.redirect('/students')
    }
  }

  static async removeStudent(req, res) {
    try {
      await StudentService.removeOne(req.params.student_id)
      res.redirect('/students')
    } catch (err) {
      console.log(err)
      req.flash('error_msg', 'Last Operation Failed')
      res.redirect('/students')
    }
  }

}

module.exports = StudentController