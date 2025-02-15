package servlets;

import database.DB_Connection;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(name = "CheckDupl", urlPatterns = {"/CheckDupl"})
public class CheckDupl extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        String username = request.getParameter("username");
        String email = request.getParameter("email");
        String telephone = request.getParameter("telephone");

        try ( Connection con = DB_Connection.getConnection()) {

            if (isDuplicate(con, "users", "username", username) || isDuplicate(con, "volunteers", "username", username)) {
                sendError(response, "Duplicate username found");
                return;
            }

            if (isDuplicate(con, "users", "email", email) || isDuplicate(con, "volunteers", "email", email)) {
                sendError(response, "Duplicate email found");
                return;
            }

            if (isDuplicate(con, "users", "telephone", telephone) || isDuplicate(con, "volunteers", "telephone", telephone)) {
                sendError(response, "Duplicate telephone found");
                return;
            }

            response.getWriter().write("No duplicates found");
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("Error: " + e.getMessage());
        }
    }

    private boolean isDuplicate(Connection con, String table, String column, String value) throws Exception {
        String query = "SELECT COUNT(*) AS total FROM " + table + " WHERE " + column + " = ?";
        try ( PreparedStatement pstmt = con.prepareStatement(query)) {
            pstmt.setString(1, value);
            try ( ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt("total") > 0;
                }
            }
        }
        return false;
    }

    private void sendError(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        response.getWriter().write(message);
    }
}
