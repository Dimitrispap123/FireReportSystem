package servlets;

import database.tables.EditIncidentsTable;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(name = "DeleteIncident", urlPatterns = {"/DeleteIncident"})
public class DeleteIncident extends HttpServlet {

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        String incidentId = request.getParameter("incident_id");

        if (incidentId == null || incidentId.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.write("{\"status\": \"error\", \"message\": \"Incident ID is required.\"}");
            return;
        }

        try {

            EditIncidentsTable editIncidentsTable = new EditIncidentsTable();
            editIncidentsTable.deleteIncident(incidentId);

            response.setStatus(HttpServletResponse.SC_OK);
            out.write("{\"status\": \"success\", \"message\": \"Incident deleted successfully.\"}");

        } catch (SQLException | ClassNotFoundException ex) {

            System.err.println("Error deleting incident: " + ex.getMessage());
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.write("{\"status\": \"error\", \"message\": \"" + ex.getMessage() + "\"}");
        }
        System.out.println("Received incident_id: " + incidentId);

    }
}
