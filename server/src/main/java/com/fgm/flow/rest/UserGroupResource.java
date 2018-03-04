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
    
        public GetDataOut(Membership membership)
        {
            this.id = membership.getUserGroup().getId();
            this.name = membership.getUserGroup().getName();
            this.status = membership.getStatus();
            this.time = membership.getTime();
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
                
        for(Membership membership : user.getMemberships())
        {
            getDataOutList.add(new GetDataOut(membership));
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
    
    @PUT
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

    static class JoinData
    {
        public Integer userid;
        public Integer id;
    }

    static class JoinDataOut
    {
        public Integer userid;
        public Integer id;
        
        public JoinDataOut(Membership membership)
        {
            this.userid = membership.getUser().getId();
            this.id = membership.getUserGroup().getId();
        }
    }
    
    @POST
    @Path("join")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response joinRequest(JoinData inData)
    {
        // Respond with status 'bad request' if userid and id haven't been
        // supplied
        if(inData.userid == null || inData.id == null)
        {
            return Response.status(BAD_REQUEST).build();
        }
        
        User user = userReg.find(inData.userid);
        UserGroup userGroup = uGroupReg.find(inData.id);

        // Respond with status 'not found' if the user and user group
        // corresponding to the id:s supplied do not exist
        if(user == null || userGroup == null)
        {
            return Response.status(NOT_FOUND).build();
        }
        
        // Respond with status 'unauthorized' if the given user hasn't got the
        // membership status 'invited' for the given user group
        if(!user.isInvitedToGroup(userGroup))
        {
            return Response.status(UNAUTHORIZED).build();
        }
        
        // Update the membership to status 'active member'
        Membership membership = new Membership(user, userGroup, 1);
        memshipReg.update(membership);
        
        return Response.ok(gson.toJson(new JoinDataOut(membership))).build();
    }

    static class InviteData
    {
        public Integer userid;
        public Integer invitedid;
        public Integer id;
    }

    static class InviteDataOut
    {
        public Integer invitedid;
        public Integer id;
        
        public InviteDataOut(Membership membership)
        {
            this.invitedid = membership.getUser().getId();
            this.id = membership.getUserGroup().getId();
        }
    }
    
    
    @POST
    @Path("invite")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response inviteRequest(InviteData inData)
    {
        // Respond with status 'bad request' if userid, invitedid 
        // and id haven't been supplied
        if(inData.userid == null || inData.userid == null || inData.id == null)
        {
            return Response.status(BAD_REQUEST).build();
        }
        
        User user = userReg.find(inData.userid);
        User invited = userReg.find(inData.invitedid);
        UserGroup userGroup = uGroupReg.find(inData.id);

        // Respond with status 'not found' if the user, invited user 
        // and user group corresponding to the id:s supplied do not exist
        if(user == null || invited == null || userGroup == null)
        {
            return Response.status(NOT_FOUND).build();
        }
        
        // Respond with status 'unauthorized' if the given user hasn't got the
        // membership status 'owner' for the given user group
        if(!user.isOwnerOfGroup(userGroup))
        {
            return Response.status(UNAUTHORIZED).build();
        }
        
        // Create a membership with the 'invited' status for the invited
        Membership membership = new Membership(invited, userGroup, 2);
        memshipReg.create(membership);
        
        return Response.ok(gson.toJson(new InviteDataOut(membership))).build();
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
