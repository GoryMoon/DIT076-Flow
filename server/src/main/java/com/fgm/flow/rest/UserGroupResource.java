/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fgm.flow.rest;

import com.fgm.flow.core.Post;
import com.fgm.flow.core.User;
import com.fgm.flow.core.UserGroup;
import com.fgm.flow.core.Membership;
import com.fgm.flow.dao.PostRegistry;
import com.fgm.flow.dao.UserRegistry;
import com.fgm.flow.dao.UserGroupRegistry;
import com.fgm.flow.dao.MembershipRegistry;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.net.URI;
import java.util.List;
import static java.lang.System.out;
import static java.lang.System.err;
import javax.ejb.EJB;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.Produces;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import static javax.ws.rs.core.Response.Status.*;
import java.util.Date;
import java.util.List;
import java.util.ArrayList;
import static java.util.Collections.sort;
import java.util.Comparator;

/**
 *
 * @author fgm
 */
@Path("group")
public class UserGroupResource {

    //private static final Logger LOG = Logger.getLogger(UserResource.class.getName());

    @Context
    private UriInfo uriInfo;

    //@EJB
    //private PostRegistry postReg;
    @EJB
    private UserRegistry userReg;
    @EJB
    private UserGroupRegistry uGroupReg;
    @EJB
    private MembershipRegistry memshipReg;
    private final Gson gson = new Gson();
    
    GsonBuilder gb = new GsonBuilder();
    Gson gsonEWE = gb.excludeFieldsWithoutExposeAnnotation().create();
    
    
    static class GetData
    {
        public Integer userid;
        public Integer id;
        public String name;
        public Date before;
        public Date after;
        public Integer count;
    }
    
    static class GetDataOut
    {
        public Integer id;
        public String name;
        public Integer status;
        public Date time;
    
        public GetDataOut(UserGroup userGroup, User user)
        {
            this.id = userGroup.getId();
            this.name = userGroup.getName();
            this.status = user.getMembershipStatus(userGroup);
            this.time = userGroup.getTime();
        }
    }
    
    @POST
    @Path("get")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response getRequest(GetData inData)
    {
        // Most GetData fields ignored currently
        
        if(inData.userid == null)
        {
            return Response.status(BAD_REQUEST).build();
        }
        
        User user = userReg.find(inData.userid);
        
        // Return status 'not found' if user does not exist
        if(user == null)
        {
            return Response.status(NOT_FOUND).build();
        }
        
        List<GetDataOut> getDataOutList = new ArrayList<>();
        
        for(UserGroup userGroup : user.getUserGroups())
        {
            getDataOutList.add(new GetDataOut(userGroup, user));
        }

        // Sort the groups based on their names
        sort(getDataOutList, new GDOComparator());
        
        return Response.ok(gson.toJson(getDataOutList)).build();
    }    
    
    private class GDOComparator implements Comparator<GetDataOut>
    {
        @Override
        public int compare(GetDataOut lGDO, GetDataOut rGDO)
        {
            return  lGDO.name.compareTo(rGDO.name);
        }
    }
    
    static class PutData
    {
        public Integer userid;
        public Integer id;
        public String name;
    }
    
    static class PutDataOut
    {
        public Integer id;
        public String name;
        public Date time;
    
        public PutDataOut(UserGroup userGroup)
        {
            this.id = userGroup.getId();
            this.name = userGroup.getName();
            this.time = userGroup.getTime();
        }
    }
    
    @POST
    @Path("put")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response putRequest(PutData inData)
    {
        return Response.status(NOT_IMPLEMENTED).build();
    }
    
    
    static class PostData
    {
        public Integer userid;
        public String name;
    }
    
    static class PostDataOut
    {
        public Integer id;
        public String name;
        public Date time;
    
        public PostDataOut(UserGroup userGroup)
        {
            this.id = userGroup.getId();
            this.name = userGroup.getName();
            this.time = userGroup.getTime();
        }
    }    
    
    @POST
    @Path("post")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response postRequest(PostData inData)
    {
        // Most GetData fields ignored currently
        
        if(inData.userid == null || inData.name == null)
        {
            return Response.status(BAD_REQUEST).build();
        }       
        
        User user = userReg.find(inData.userid);
        List<UserGroup> uGroupsWName = uGroupReg.findByName(inData.name);
        
        // Respond with status 'forbidden' if the user doesn't exist or if
        // there already is a group with the given name
        if(user == null || uGroupsWName.size() != 0)
        {
            return Response.status(FORBIDDEN).build();
        }
  
        UserGroup userGroup = new UserGroup(inData.name);

        uGroupReg.create(userGroup);

        // Also create the membership and give the user owner status
        Membership membership = new Membership(user, userGroup, 0);

        memshipReg.create(membership);
        
        return Response.ok(gson.toJson(new PostDataOut(userGroup))).build();
    }
    
    
    
    
    
    
    
    
    @POST
    @Path("create")
    @Consumes({MediaType.APPLICATION_FORM_URLENCODED})
    public Response create(
            @FormParam("name") String name,
            @FormParam("ownerId") int ownerId
        ) 
    {
        User owner = userReg.find(ownerId);
        List<UserGroup> uGroupsWithName = uGroupReg.findByName(name);
        
        if(owner != null && uGroupsWithName.size() == 0)
        {        
            UserGroup userGroup = new UserGroup(name);

            uGroupReg.create(userGroup);
            
            Membership membership = new Membership(owner, userGroup, 0);

            memshipReg.create(membership);
            
            URI userGroupUri = uriInfo
                    .getAbsolutePathBuilder()
                    .path(String.valueOf(userGroup.getId()))
                    .build(userGroup);
            
            return Response.created(userGroupUri).build();
        }
        
        return Response.status(403).build();
        
    }
   
    
    @GET
    @Produces({MediaType.APPLICATION_JSON})
    public Response findAll()
    {        
        List<UserGroup> userGroups = uGroupReg.findAll();

        return Response.ok(gsonEWE.toJson(userGroups)).build();
    }
}
