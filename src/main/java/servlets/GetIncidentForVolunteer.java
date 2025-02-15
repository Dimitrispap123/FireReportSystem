package servlets;

import com.google.gson.Gson;
import database.DB_Connection;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import mainClasses.Incident;

/**
 *
 * @author user
 */
@WebServlet(name = "GetIncidentForVolunteer", urlPatterns = {"/GetIncidentForVolunteer"})
public class GetIncidentForVolunteer extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        String volunteerUsername = request.getParameter("volunteer_username");

        if (volunteerUsername == null || volunteerUsername.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.write("{\"status\": \"error\", \"message\": \"Missing volunteer username\"}");
            return;
        }

        try {
            ArrayList<Incident> incidents = getIncidentsByVolunteer(volunteerUsername);

            if (incidents != null && !incidents.isEmpty()) {
                Gson gson = new Gson();
                String jsonResponse = gson.toJson(incidents);
                out.write(jsonResponse);
                response.setStatus(HttpServletResponse.SC_OK);
            } else {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                out.write("{\"status\": \"error\", \"message\": \"No incidents found for this volunteer\"}");
            }

        } catch (SQLException | ClassNotFoundException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.write("{\"status\": \"error\", \"message\": \"" + e.getMessage() + "\"}");
        }
    }

    private ArrayList<Incident> getIncidentsByVolunteer(String volunteerUsername) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ResultSet rs = stmt.executeQuery("SELECT incidents.* FROM incidents "
                + "JOIN participants ON incidents.incident_id = participants.incident_id "
                + "WHERE participants.volunteer_username = '" + volunteerUsername + "'");

        ArrayList<Incident> incidents = new ArrayList<>();
        while (rs.next()) {
            Incident incident = new Incident();
            incident.setIncident_id(rs.getInt("incident_id"));
            incident.setIncident_type(rs.getString("incident_type"));
            incident.setDescription(rs.getString("description"));
            incident.setUser_phone(rs.getString("user_phone"));
            incident.setUser_type(rs.getString("user_type"));
            incident.setAddress(rs.getString("address"));
            incident.setLat(rs.getDouble("lat"));
            incident.setLon(rs.getDouble("lon"));
            incident.setMunicipality(rs.getString("municipality"));
            incident.setPrefecture(rs.getString("prefecture"));
            incident.setDanger(rs.getString("danger"));
            incident.setStatus(rs.getString("status"));
            incident.setFinalResult(rs.getString("finalResult"));
            incident.setVehicles(rs.getInt("vehicles"));
            incident.setFiremen(rs.getInt("firemen"));
            incidents.add(incident);
        }

        return incidents;
    }
}
