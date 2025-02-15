package servlets;

import com.google.gson.Gson;
import database.tables.EditVolunteersTable;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import mainClasses.Volunteer;

@WebServlet(name = "SaveVolunteerChanges", urlPatterns = {"/SaveVolunteerChanges"})
public class SaveVolunteerChanges extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        StringBuilder jsonBuilder = new StringBuilder();
        try ( BufferedReader reader = request.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                jsonBuilder.append(line);
            }
        }

        String jsonData = jsonBuilder.toString();

        try {

            Gson gson = new Gson();
            Volunteer updatedVolunteer = gson.fromJson(jsonData, Volunteer.class);

            EditVolunteersTable volunteerTable = new EditVolunteersTable();

            volunteerTable.updateVolunteer(updatedVolunteer.getUsername(), updatedVolunteer);

            response.setStatus(HttpServletResponse.SC_OK);
            out.write("{\"status\": \"success\"}");

        } catch (SQLException | ClassNotFoundException ex) {
            Logger.getLogger(SaveVolunteerChanges.class.getName()).log(Level.SEVERE, null, ex);
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.write("{\"status\": \"error\", \"message\": \"" + ex.getMessage() + "\"}");
        }
    }
}
