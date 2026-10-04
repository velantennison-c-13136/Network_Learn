import jakarta.servlet.*;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import javax.naming.*;
import javax.sql.DataSource;
import java.io.IOException;

// Annotation maps this servlet to URL pattern /products/*
@WebServlet(
    name = "ProductServlet",
    urlPatterns = {"/products", "/products/*"},
    loadOnStartup = 1          // load at startup, don't wait for first request
)
public class ProductServlet extends HttpServlet {

    private ProductService service;

    @Override
    public void init() throws ServletException {
        // Runs ONCE when servlet is first loaded
        // Look up a JDBC DataSource from Tomcat's JNDI context
        try {
            Context ctx = new InitialContext();
            DataSource ds = (DataSource) ctx.lookup("java:comp/env/jdbc/MyDB");
            this.service = new ProductService(ds);
        } catch (NamingException e) {
            throw new ServletException("JNDI lookup failed", e);
        }
    }

    @Override
    protected void doGet(HttpServletRequest req,
                         HttpServletResponse res)
            throws ServletException, IOException {

        String id = req.getPathInfo();           // e.g. /42
        String format = req.getParameter("fmt"); // e.g. ?fmt=json

        // Security: check session / role
        HttpSession session = req.getSession(false);
        if (session == null || session.getAttribute("user") == null) {
            res.sendRedirect(req.getContextPath() + "/login.jsp");
            return;
        }

        // Fetch data
        Product product = service.findById(id);

        // Respond: JSON or HTML
        if ("json".equalsIgnoreCase(format)) {
            res.setContentType("application/json;charset=UTF-8");
            res.getWriter().println(product.toJson());
        } else {
            req.setAttribute("product", product);
            req.getRequestDispatcher("/WEB-INF/views/product.jsp")
               .forward(req, res);     // forward to JSP for rendering
        }
    }

    @Override
    protected void doPost(HttpServletRequest req,
                          HttpServletResponse res)
            throws ServletException, IOException {

        // Parse body parameters
        String name  = req.getParameter("name");
        String price = req.getParameter("price");

        // CSRF token validation example
        String csrfToken    = req.getParameter("_csrf");
        String sessionToken = (String) req.getSession().getAttribute("csrfToken");
        if (!csrfToken.equals(sessionToken)) {
            res.sendError(403, "CSRF validation failed");
            return;
        }

        service.create(name, Double.parseDouble(price));
        res.sendRedirect(req.getContextPath() + "/products");
    }

    @Override
    public void destroy() {
        // Runs ONCE when servlet is unloaded (app undeploy / restart)
        service.close();
    }
}
