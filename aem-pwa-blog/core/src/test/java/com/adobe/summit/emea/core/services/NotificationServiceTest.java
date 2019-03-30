/*
 *  Copyright 2018 Adobe Systems Incorporated
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
package com.adobe.summit.emea.core.services;

import com.adobe.summit.emea.core.services.impl.NotificationServiceImpl;
import com.adobe.summit.emea.core.servlets.SimpleServlet;
import org.apache.sling.testing.mock.sling.junit.SlingContext;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletResponse;
import org.junit.Rule;
import org.junit.Test;

import javax.servlet.ServletException;
import java.io.IOException;
import java.util.Map;

import static org.junit.Assert.assertEquals;

public class NotificationServiceTest {

    @Rule
    public final SlingContext context = new SlingContext();

    private NotificationService notificationService = new NotificationServiceImpl();

    @Test
    public void testNotificationService() throws Exception {

        Map<String,String> keys = notificationService.generateKeys();
        assertEquals("Title = resource title", keys.get("PublicKey"));
    }
}
