import java.util.ArrayList;
import java.util.Scanner;

// Student Class definition
class Student {
    String name;
    String email;
    String phone;

    // Constructor
    public Student(String name, String email, String phone) {
        this.name = name;
        this.email = email;
        this.phone = phone;
    }

    // Method to display student details
    public void displayStudent() {
        System.out.println("----------------------------------------");
        System.out.println("Name  : " + name);
        System.out.println("Email : " + email);
        System.out.println("Phone : " + phone);
        System.out.println("----------------------------------------");
    }
}

// Main Management Application Class
public class StudentManagement {

    private static ArrayList<Student> students = new ArrayList<>();
    private static Scanner scanner = new Scanner(System.in);

    // Option 1: Add Student
    public static void addStudent() {
        System.out.println("\n--- Add New Student ---");
        System.out.print("Enter Name: ");
        String name = scanner.nextLine().trim();

        System.out.print("Enter Email: ");
        String email = scanner.nextLine().trim();

        System.out.print("Enter Phone: ");
        String phone = scanner.nextLine().trim();

        if (name.isEmpty() || email.isEmpty() || phone.isEmpty()) {
            System.out.println("Error: All fields are required! Student not added.");
            return;
        }

        Student newStudent = new Student(name, email, phone);
        students.add(newStudent);
        System.out.println("Success: Student added successfully!");
    }

    // Option 2: View Students
    public static void viewStudents() {
        System.out.println("\n--- Student List ---");
        if (students.isEmpty()) {
            System.out.println("No student records found.");
            return;
        }

        for (int i = 0; i < students.size(); i++) {
            System.out.println("Record #" + (i + 1));
            students.get(i).displayStudent();
        }
    }

    // Option 3: Search Student
    public static void searchStudent() {
        System.out.println("\n--- Search Student ---");
        if (students.isEmpty()) {
            System.out.println("No student records found in database.");
            return;
        }

        System.out.print("Enter Name to Search: ");
        String searchName = scanner.nextLine().trim();
        boolean found = false;

        for (Student s : students) {
            if (s.name.toLowerCase().contains(searchName.toLowerCase())) {
                System.out.println("\nMatch Found:");
                s.displayStudent();
                found = true;
            }
        }

        if (!found) {
            System.out.println("No student matching search query: \"" + searchName + "\"");
        }
    }

    // Main Method with CLI Loop
    public static void main(String[] args) {
        while (true) {
            System.out.println("\n===== Student Management =====");
            System.out.println("1. Add Student");
            System.out.println("2. View Students");
            System.out.println("3. Search Student");
            System.out.println("4. Exit");
            System.out.print("Enter your choice (1-4): ");

            String choiceInput = scanner.nextLine().trim();
            int choice = -1;

            try {
                choice = Integer.parseInt(choiceInput);
            } catch (NumberFormatException e) {
                System.out.println("Invalid input! Please enter a number between 1 and 4.");
                continue;
            }

            switch (choice) {
                case 1:
                    addStudent();
                    break;
                case 2:
                    viewStudents();
                    break;
                case 3:
                    searchStudent();
                    break;
                case 4:
                    System.out.println("Exiting Student Management Application. Goodbye!");
                    System.exit(0);
                    break;
                default:
                    System.out.println("Invalid option! Please choose between 1 and 4.");
            }
        }
    }
}
