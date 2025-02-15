package servlets;

import com.google.gson.Gson;
import database.tables.EditIncidentsTable;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.HashMap;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(name = "UpdateAllIncidents", urlPatterns = {"/UpdateAllIncidents"})
public class UpdateAllIncidents extends HttpServlet {

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
        Gson gson = new Gson();
        IncidentUpdate[] updates = gson.fromJson(jsonData, IncidentUpdate[].class);

        try {
            EditIncidentsTable editIncidentsTable = new EditIncidentsTable();

            for (IncidentUpdate update : updates) {
                HashMap<String, String> updateMap = new HashMap<>();
                for (String key : update.updates.keySet()) {
                    updateMap.put(key, update.updates.get(key));
                }

                editIncidentsTable.updateIncident(update.incident_id, updateMap);
            }

            response.setStatus(HttpServletResponse.SC_OK);
            out.write("{\"status\": \"success\"}");

        } catch (SQLException | ClassNotFoundException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.write("{\"status\": \"error\", \"message\": \"" + e.getMessage() + "\"}");
        }
    }

    private static class IncidentUpdate {

        String incident_id;
        HashMap<String, String> updates;
    }
}
