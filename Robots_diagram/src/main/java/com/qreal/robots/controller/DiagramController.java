package com.qreal.robots.controller;

import com.qreal.robots.dao.DiagramDAO;
import com.qreal.robots.model.Diagram;
import com.qreal.robots.model.OpenRequest;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

/**
 * Created by vladzx on 25.10.14.
 */
@Controller
public class DiagramController {
    private static final Logger LOG = Logger.getLogger(DiagramController.class);

    @Autowired
    private DiagramDAO diagramDAO;

    @RequestMapping("/")
    public ModelAndView home() {
        LOG.info("redirect from / to /diagram");
        return new ModelAndView("redirect:/diagram");
    }

    @RequestMapping(value = "/diagram", method = RequestMethod.GET)
    public ModelAndView index(Model model) {
        return new ModelAndView("index");
    }

    @RequestMapping(value = "/save", method = RequestMethod.POST)
    public
    @ResponseBody
    String save(@RequestBody Diagram diagram) {
        LOG.info("save diagram");
        diagramDAO.save(diagram);
        return "{\"message\":\"OK\"}";
    }

    @RequestMapping(value = "/open", method = RequestMethod.POST)
    public
    @ResponseBody
    Diagram open(@RequestBody OpenRequest request) {
        LOG.info("open diagram");
        return diagramDAO.openById(request.getDiagramId());
    }
}
