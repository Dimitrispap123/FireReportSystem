package servlets;

import database.tables.EditIncidentsTable;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;

@WebServlet(name = "RegisterIncident", urlPatterns = {"/RegisterIncident"})
public class RegisterIncident extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        StringBuilder jsonBuffer = new StringBuilder();
        try ( BufferedReader reader = request.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                jsonBuffer.append(line);
            }
        }

        String json = jsonBuffer.toString();

        try {
            EditIncidentsTable incidentsTable = new EditIncidentsTable();
            incidentsTable.addIncidentFromJSON(json); // Add incident to database

            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write("{\"message\": \"Incident successfully registered.\"}");
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"message\": \"Failed to register incident.\"}");
        }
    }
}
